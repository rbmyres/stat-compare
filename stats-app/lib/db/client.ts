import { query, queryOne } from './connection';
import type { Player, Team, PlayerStats, TeamStats, DateRangeParams } from './types';

// Get all players (for search/listing)
export async function getPlayers(search?: string, limit = 100): Promise<Player[]> {
  if (search) {
    return query<Player>(
      `SELECT player_id, first_name, last_name, first_season, last_season
       FROM players
       WHERE LOWER(first_name || ' ' || last_name) LIKE LOWER($1)
       ORDER BY last_season DESC, first_name, last_name
       LIMIT $2`,
      [`%${search}%`, limit]
    );
  }
  return query<Player>(
    `SELECT player_id, first_name, last_name, first_season, last_season
     FROM players
     ORDER BY last_season DESC, first_name, last_name
     LIMIT $1`,
    [limit]
  );
}

// Get single player by ID
export async function getPlayer(playerId: string): Promise<Player | null> {
  return queryOne<Player>(
    `SELECT player_id, first_name, last_name, first_season, last_season
     FROM players
     WHERE player_id = $1`,
    [playerId]
  );
}

// Get player stats using the player_stats() function
export async function getPlayerStats(
  playerId: string,
  params: DateRangeParams = {}
): Promise<PlayerStats | null> {
  const { seasonStart, seasonEnd, weekStart, weekEnd, seasonType } = params;

  return queryOne<PlayerStats>(
    `SELECT * FROM player_stats($1, $2, $3, $4, $5, $6)`,
    [
      playerId,
      seasonStart ?? null,
      seasonEnd ?? null,
      weekStart ?? null,
      weekEnd ?? null,
      seasonType ?? null,
    ]
  );
}

// Get all players' stats (for leaderboards/comparisons)
export async function getAllPlayerStats(
  params: DateRangeParams = {},
  limit = 100
): Promise<PlayerStats[]> {
  const { seasonStart, seasonEnd, weekStart, weekEnd, seasonType } = params;

  const results = await query<PlayerStats>(
    `SELECT * FROM player_stats(NULL, $1, $2, $3, $4, $5)`,
    [
      seasonStart ?? null,
      seasonEnd ?? null,
      weekStart ?? null,
      weekEnd ?? null,
      seasonType ?? null,
    ]
  );

  return results.slice(0, limit);
}

// Get all teams
export async function getTeams(): Promise<Team[]> {
  return query<Team>(
    `SELECT team_id, abbr, display_name, nickname, primary_color
     FROM teams
     ORDER BY display_name`
  );
}

// Get single team by ID
export async function getTeam(teamId: string): Promise<Team | null> {
  return queryOne<Team>(
    `SELECT team_id, abbr, display_name, nickname, primary_color
     FROM teams
     WHERE team_id = $1`,
    [teamId]
  );
}

// Get team stats using the team_stats() function
export async function getTeamStats(
  teamId: string,
  params: DateRangeParams = {}
): Promise<TeamStats | null> {
  const { seasonStart, seasonEnd, weekStart, weekEnd, seasonType } = params;

  return queryOne<TeamStats>(
    `SELECT * FROM team_stats($1, $2, $3, $4, $5, $6)`,
    [
      teamId,
      seasonStart ?? null,
      seasonEnd ?? null,
      weekStart ?? null,
      weekEnd ?? null,
      seasonType ?? null,
    ]
  );
}

// Get all teams' stats (for comparisons/charts)
export async function getAllTeamStats(
  params: DateRangeParams = {}
): Promise<TeamStats[]> {
  const { seasonStart, seasonEnd, weekStart, weekEnd, seasonType } = params;

  return query<TeamStats>(
    `SELECT * FROM team_stats(NULL, $1, $2, $3, $4, $5)`,
    [
      seasonStart ?? null,
      seasonEnd ?? null,
      weekStart ?? null,
      weekEnd ?? null,
      seasonType ?? null,
    ]
  );
}

// Get available seasons
export async function getSeasons(): Promise<number[]> {
  const results = await query<{ season: number }>(
    `SELECT DISTINCT season FROM weeks ORDER BY season DESC`
  );
  return results.map((r) => r.season);
}

// Get weeks for a season
export async function getWeeks(
  season: number,
  seasonType?: 'REG' | 'POST'
): Promise<{ season: number; week: number; season_type: string }[]> {
  if (seasonType) {
    return query(
      `SELECT season, week, season_type FROM weeks
       WHERE season = $1 AND season_type = $2
       ORDER BY week`,
      [season, seasonType]
    );
  }
  return query(
    `SELECT season, week, season_type FROM weeks
     WHERE season = $1
     ORDER BY week`,
    [season]
  );
}
