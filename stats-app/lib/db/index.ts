// Database connection and utilities
export { default as pool, query, queryOne } from './connection';

// Database client functions
export {
  getPlayers,
  getPlayer,
  getPlayerStats,
  getAllPlayerStats,
  getTeams,
  getTeam,
  getTeamStats,
  getAllTeamStats,
  getSeasons,
  getWeeks,
} from './client';

// Types
export type {
  Player,
  Team,
  PlayerStats,
  TeamStats,
  DateRangeParams,
  SearchResult,
} from './types';
