import {
  parseAsInteger,
  parseAsStringLiteral,
  createSearchParamsCache,
} from "nuqs/server";

export const MIN_SEASON = 1999;
export const CURRENT_SEASON = 2025;
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
