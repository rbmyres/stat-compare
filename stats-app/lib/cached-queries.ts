import { cache } from "react";
import { query, queryOne } from "@/lib/db";
import type { PlayerStats } from "@/lib/types/player-stats";
import type { TeamStats } from "@/lib/types/team-stats";
import type { Player, Team } from "@/lib/types";

export const getAllPlayerStats = cache(
  async (
    seasonStart: number,
    seasonEnd: number,
    weekStart: number,
    weekEnd: number,
    seasonType: string
  ) => {
    return query<PlayerStats>(
      "SELECT * FROM player_stats($1, $2, $3, $4, $5, $6)",
      [null, seasonStart, seasonEnd, weekStart, weekEnd, seasonType]
    );
  }
);

export const getAllTeamStats = cache(
  async (
    seasonStart: number,
    seasonEnd: number,
    weekStart: number,
    weekEnd: number,
    seasonType: string
  ) => {
    return query<TeamStats>(
      "SELECT * FROM team_stats($1, $2, $3, $4, $5, $6)",
      [null, seasonStart, seasonEnd, weekStart, weekEnd, seasonType]
    );
  }
);

export const getPlayer = cache(async (id: string) => {
  return queryOne<Player>(
    "SELECT player_id, first_name, last_name, first_season, last_season, headshot_url FROM players WHERE player_id = $1",
    [id]
  );
});

export const getTeam = cache(async (id: string) => {
  return queryOne<Team>(
    "SELECT team_id, abbr, display_name, nickname, primary_color, logo_url FROM teams WHERE team_id = $1",
    [id]
  );
});
