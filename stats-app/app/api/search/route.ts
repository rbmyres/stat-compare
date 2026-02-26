import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";
import type { SearchResult } from "@/lib/types";

const searchSchema = z.object({
  q: z.string().min(2).max(100),
});

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get("q") || "";
    const type = request.nextUrl.searchParams.get("type"); // optional: "player" | "team"
    const validation = searchSchema.safeParse({ q });

    if (!validation.success) {
      return NextResponse.json({ results: [] });
    }

    const term = `%${validation.data.q}%`;

    const [players, teams] = await Promise.all([
      type === "team"
        ? Promise.resolve([])
        : query<{ player_id: string; first_name: string; last_name: string; first_season: number; last_season: number; headshot_url: string | null }>(
            `SELECT player_id, first_name, last_name, first_season, last_season, headshot_url
             FROM players
             WHERE LOWER(first_name || ' ' || last_name) LIKE LOWER($1)
             ORDER BY last_season DESC, first_name, last_name
             LIMIT 8`,
            [term]
          ),
      type === "player"
        ? Promise.resolve([])
        : query<{ team_id: string; display_name: string; nickname: string; logo_url: string | null }>(
            `SELECT team_id, display_name, nickname, logo_url
             FROM teams
             WHERE LOWER(display_name) LIKE LOWER($1)
                OR LOWER(nickname) LIKE LOWER($1)
                OR LOWER(abbr) LIKE LOWER($1)
             ORDER BY display_name
             LIMIT 5`,
            [term]
          ),
    ]);

    const results: SearchResult[] = [
      ...teams.map((t) => ({
        type: "team" as const,
        id: t.team_id,
        name: t.display_name,
        subtitle: t.nickname,
        image_url: t.logo_url ?? undefined,
      })),
      ...players.map((p) => ({
        type: "player" as const,
        id: p.player_id,
        name: `${p.first_name} ${p.last_name}`,
        subtitle: p.first_season === p.last_season
          ? `${p.first_season}`
          : `${p.first_season}–${p.last_season}`,
        image_url: p.headshot_url ?? undefined,
      })),
    ];

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
