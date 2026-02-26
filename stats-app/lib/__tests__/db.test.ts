import { vi, beforeEach } from "vitest";

const mockPoolQuery = vi.fn();

vi.mock("pg", () => ({
  Pool: class MockPool {
    query = mockPoolQuery;
    on = vi.fn();
  },
}));

const { query, queryOne, DatabaseError } = await import("../db");

describe("query", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns rows from pool.query", async () => {
    mockPoolQuery.mockResolvedValueOnce({ rows: [{ id: 1 }, { id: 2 }] });
    const result = await query("SELECT * FROM test");
    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it("passes params to pool.query", async () => {
    mockPoolQuery.mockResolvedValueOnce({ rows: [] });
    await query("SELECT * FROM test WHERE id = $1", [42]);
    expect(mockPoolQuery).toHaveBeenCalledWith(
      "SELECT * FROM test WHERE id = $1",
      [42]
    );
  });

  it("returns empty array for no results", async () => {
    mockPoolQuery.mockResolvedValueOnce({ rows: [] });
    const result = await query("SELECT * FROM test WHERE 1=0");
    expect(result).toEqual([]);
  });

  it("wraps errors in DatabaseError", async () => {
    mockPoolQuery.mockRejectedValueOnce(new Error("connection failed"));
    await expect(query("SELECT 1")).rejects.toThrow(DatabaseError);
  });

  it("preserves original error as cause", async () => {
    const original = new Error("timeout");
    mockPoolQuery.mockRejectedValueOnce(original);
    try {
      await query("SELECT 1");
    } catch (err) {
      expect(err).toBeInstanceOf(DatabaseError);
      expect((err as InstanceType<typeof DatabaseError>).cause).toBe(original);
    }
  });
});

describe("queryOne", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns first row", async () => {
    mockPoolQuery.mockResolvedValueOnce({ rows: [{ id: 1 }] });
    const result = await queryOne("SELECT * FROM test LIMIT 1");
    expect(result).toEqual({ id: 1 });
  });

  it("returns null for empty results", async () => {
    mockPoolQuery.mockResolvedValueOnce({ rows: [] });
    const result = await queryOne("SELECT * FROM test WHERE id = $1", [999]);
    expect(result).toBeNull();
  });

  it("wraps errors in DatabaseError", async () => {
    mockPoolQuery.mockRejectedValueOnce(new Error("timeout"));
    await expect(queryOne("SELECT 1")).rejects.toThrow(DatabaseError);
  });
});

describe("DatabaseError", () => {
  it("has correct name", () => {
    const err = new DatabaseError("test");
    expect(err.name).toBe("DatabaseError");
  });

  it("stores message", () => {
    const err = new DatabaseError("something failed");
    expect(err.message).toBe("something failed");
  });

  it("stores cause", () => {
    const cause = new Error("original");
    const err = new DatabaseError("wrapped", cause);
    expect(err.cause).toBe(cause);
  });

  it("is an instance of Error", () => {
    const err = new DatabaseError("test");
    expect(err).toBeInstanceOf(Error);
  });
});
