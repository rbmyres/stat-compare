import {
  parseAsInteger,
  parseAsStringLiteral,
  createSearchParamsCache,
} from "nuqs/server";

export const MIN_SEASON = 1999;

// NFL season spans two calendar years (e.g. 2025 season: Sep 2025 – Feb 2026).
// Before March we're still in the previous year's season.
function getCurrentNFLSeason(): number {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed: 0=Jan, 2=Mar
  return month < 3 ? year - 1 : year;
}

export const CURRENT_SEASON = getCurrentNFLSeason();
export const MIN_WEEK = 1;
export const MAX_WEEK = 22;

export const SEASON_TYPES = ["REG", "POST", "BOTH"] as const;
export type SeasonType = (typeof SEASON_TYPES)[number];

export const filterParsers = {
  startYear: parseAsInteger.withDefault(CURRENT_SEASON),
  startWeek: parseAsInteger.withDefault(MIN_WEEK),
  endYear: parseAsInteger.withDefault(CURRENT_SEASON),
  endWeek: parseAsInteger.withDefault(MAX_WEEK),
  seasonType: parseAsStringLiteral(SEASON_TYPES).withDefault(
    "REG" as SeasonType
  ),
};

export const searchParamsCache = createSearchParamsCache(filterParsers);

export type FilterValues = {
  startYear: number;
  startWeek: number;
  endYear: number;
  endWeek: number;
  seasonType: SeasonType;
};
