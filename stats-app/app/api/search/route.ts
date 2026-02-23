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
    const validation = searchSchema.safeParse({ q });

    if (!validation.success) {
      return NextResponse.json({ results: [] });
    }

    const term = `%${validation.data.q}%`;

    const [players, teams] = await Promise.all([
      query<{ player_id: string; first_name: string; last_name: string; last_season: number }>(
        `SELECT player_id, first_name, last_name, last_season
         FROM players
         WHERE LOWER(first_name || ' ' || last_name) LIKE LOWER($1)
         ORDER BY last_season DESC, first_name, last_name
         LIMIT 8`,
        [term]
      ),
      query<{ team_id: string; display_name: string; nickname: string }>(
        `SELECT team_id, display_name, nickname
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
      })),
      ...players.map((p) => ({
        type: "player" as const,
        id: p.player_id,
        name: `${p.first_name} ${p.last_name}`,
        subtitle: `${p.last_season}`,
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
