import { vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/db", () => ({
  query: vi.fn(),
  queryOne: vi.fn(),
  DatabaseError: class DatabaseError extends Error {},
}));

// Must import after mock setup
const { GET, escapeLike } = await import("../route");
const { query } = await import("@/lib/db");
const mockQuery = query as ReturnType<typeof vi.fn>;

function createRequest(
  path: string,
  headers?: Record<string, string>
): NextRequest {
  const url = new URL(path, "http://localhost:3000");
  return new NextRequest(url, {
    headers: headers ? new Headers(headers) : undefined,
  });
}

describe("escapeLike", () => {
  it("escapes % character", () => expect(escapeLike("50%")).toBe("50\\%"));
  it("escapes _ character", () => expect(escapeLike("a_b")).toBe("a\\_b"));
  it("escapes backslash", () => expect(escapeLike("a\\b")).toBe("a\\\\b"));
  it("passes through normal strings", () =>
    expect(escapeLike("mahomes")).toBe("mahomes"));
  it("handles multiple special chars", () =>
    expect(escapeLike("%_\\")).toBe("\\%\\_\\\\"));
  it("handles empty string", () => expect(escapeLike("")).toBe(""));
});

describe("GET /api/search", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty results for query shorter than 2 chars", async () => {
    const res = await GET(createRequest("/api/search?q=a"));
    const body = await res.json();
    expect(body.results).toEqual([]);
    expect(mockQuery).not.toHaveBeenCalled();
  });

  it("returns empty results for missing query", async () => {
    const res = await GET(createRequest("/api/search"));
    const body = await res.json();
    expect(body.results).toEqual([]);
  });

  it("queries both players and teams without type filter", async () => {
    mockQuery.mockResolvedValue([]);
    const res = await GET(createRequest("/api/search?q=Patrick"));
    expect(mockQuery).toHaveBeenCalledTimes(2);
    const body = await res.json();
    expect(body.results).toEqual([]);
  });

  it("only queries players when type=player", async () => {
    mockQuery.mockResolvedValue([]);
    const res = await GET(
      createRequest("/api/search?q=Mahomes&type=player")
    );
    expect(mockQuery).toHaveBeenCalledTimes(1);
    const body = await res.json();
    expect(body.results).toEqual([]);
  });

  it("only queries teams when type=team", async () => {
    mockQuery.mockResolvedValue([]);
    const res = await GET(
      createRequest("/api/search?q=Chiefs&type=team")
    );
    expect(mockQuery).toHaveBeenCalledTimes(1);
    const body = await res.json();
    expect(body.results).toEqual([]);
  });

  it("formats player results correctly", async () => {
    mockQuery
      .mockResolvedValueOnce([
        {
          player_id: "p1",
          first_name: "Patrick",
          last_name: "Mahomes",
          first_season: 2017,
          last_season: 2024,
          headshot_url: null,
        },
      ])
      .mockResolvedValueOnce([]); // teams

    const res = await GET(createRequest("/api/search?q=Patrick"));
    const body = await res.json();
    expect(body.results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "player",
          id: "p1",
          name: "Patrick Mahomes",
          subtitle: "2017\u20132024",
        }),
      ])
    );
  });

  it("formats team results correctly", async () => {
    mockQuery
      .mockResolvedValueOnce([]) // players
      .mockResolvedValueOnce([
        {
          team_id: "KC",
          display_name: "Kansas City Chiefs",
          nickname: "Chiefs",
          logo_url: "https://example.com/kc.png",
        },
      ]);

    const res = await GET(createRequest("/api/search?q=Chiefs"));
    const body = await res.json();
    expect(body.results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "team",
          id: "KC",
          name: "Kansas City Chiefs",
          subtitle: "Chiefs",
          image_url: "https://example.com/kc.png",
        }),
      ])
    );
  });

  it("places teams before players in results", async () => {
    mockQuery
      .mockResolvedValueOnce([
        {
          player_id: "p1",
          first_name: "A",
          last_name: "B",
          first_season: 2020,
          last_season: 2020,
          headshot_url: null,
        },
      ])
      .mockResolvedValueOnce([
        {
          team_id: "KC",
          display_name: "KC",
          nickname: "Chiefs",
          logo_url: null,
        },
      ]);

    const res = await GET(createRequest("/api/search?q=test"));
    const body = await res.json();
    expect(body.results[0].type).toBe("team");
    expect(body.results[1].type).toBe("player");
  });

  it("formats single-season player subtitle without dash", async () => {
    mockQuery
      .mockResolvedValueOnce([
        {
          player_id: "p2",
          first_name: "Rookie",
          last_name: "Player",
          first_season: 2024,
          last_season: 2024,
          headshot_url: null,
        },
      ])
      .mockResolvedValueOnce([]);

    const res = await GET(createRequest("/api/search?q=Rookie"));
    const body = await res.json();
    expect(body.results[0].subtitle).toBe("2024");
  });

  it("returns 500 on database error", async () => {
    mockQuery.mockRejectedValue(new Error("connection failed"));
    const res = await GET(createRequest("/api/search?q=test"));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("Internal server error");
  });
});
