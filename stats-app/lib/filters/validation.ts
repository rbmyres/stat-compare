import { z } from "zod";
import {
  MIN_SEASON,
  CURRENT_SEASON,
  MIN_WEEK,
  MAX_WEEK,
  SEASON_TYPES,
} from "./search-params";

const baseFilterSchema = z.object({
  startYear: z.number().int().min(MIN_SEASON).max(CURRENT_SEASON),
  startWeek: z.number().int().min(MIN_WEEK).max(MAX_WEEK),
  endYear: z.number().int().min(MIN_SEASON).max(CURRENT_SEASON),
  endWeek: z.number().int().min(MIN_WEEK).max(MAX_WEEK),
  seasonType: z.enum(SEASON_TYPES),
});

export const filterSchema = baseFilterSchema.refine(
  (d) => d.startYear < d.endYear || (d.startYear === d.endYear && d.startWeek <= d.endWeek),
  { message: "Start date must be before or equal to end date" }
);

export type ValidatedFilters = z.infer<typeof baseFilterSchema>;

export function toDbParams(filters: ValidatedFilters) {
  return {
    seasonStart: filters.startYear,
    seasonEnd: filters.endYear,
    weekStart: filters.startWeek,
    weekEnd: filters.endWeek,
    seasonType:
      filters.seasonType === "BOTH" ? "REG,POST" : filters.seasonType,
  };
}
