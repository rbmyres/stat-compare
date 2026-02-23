"use client";

import { useQueryStates } from "nuqs";
import { usePathname } from "next/navigation";
import { filterParsers } from "@/lib/filters/search-params";
import { YearSelect } from "./YearSelect";
import { WeekSelect } from "./WeekSelect";
import { SeasonTypeToggle } from "./SeasonTypeToggle";

export function DateRangeFilter() {
  const pathname = usePathname();
  const [filters, setFilters] = useQueryStates(filterParsers, {
    shallow: false,
  });

  if (pathname === "/") return null;

  const hasNonDefaults =
    filters.startYear !== filterParsers.startYear.defaultValue ||
    filters.startWeek !== filterParsers.startWeek.defaultValue ||
    filters.endYear !== filterParsers.endYear.defaultValue ||
    filters.endWeek !== filterParsers.endWeek.defaultValue ||
    filters.seasonType !== filterParsers.seasonType.defaultValue;

  return (
    <div className="border-b border-foreground/[0.05] bg-foreground/[0.015]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2">

        {/* From range */}
        <WeekSelect
          label="From"
          value={filters.startWeek}
          onChange={(startWeek) => {
            const updates: Record<string, number> = { startWeek };
            if (
              filters.startYear === filters.endYear &&
              startWeek > filters.endWeek
            ) {
              updates.endWeek = startWeek;
            }
            setFilters(updates);
          }}
          max={
            filters.startYear === filters.endYear
              ? filters.endWeek
              : undefined
          }
        />
        <YearSelect
          value={filters.startYear}
          onChange={(startYear) => {
            const updates: Record<string, number> = { startYear };
            if (startYear > filters.endYear) {
              updates.endYear = startYear;
            }
            setFilters(updates);
          }}
          max={filters.endYear}
        />

        {/* Arrow separator */}
        <svg
          className="hidden h-3.5 w-3.5 shrink-0 text-foreground/15 sm:block"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>

        {/* To range */}
        <WeekSelect
          label="To"
          value={filters.endWeek}
          onChange={(endWeek) => setFilters({ endWeek })}
          min={
            filters.startYear === filters.endYear
              ? filters.startWeek
              : undefined
          }
        />
        <YearSelect
          value={filters.endYear}
          onChange={(endYear) => {
            const updates: Record<string, number> = { endYear };
            if (endYear < filters.startYear) {
              updates.startYear = endYear;
            }
            setFilters(updates);
          }}
          min={filters.startYear}
        />

        {/* Divider */}
        <div className="hidden h-4 w-px bg-foreground/[0.08] sm:block" />

        {/* Season type */}
        <SeasonTypeToggle
          value={filters.seasonType}
          onChange={(seasonType) => setFilters({ seasonType })}
        />

        {/* Reset */}
        {hasNonDefaults && (
          <button
            type="button"
            onClick={() => setFilters(null)}
            className="ml-auto flex h-7 cursor-pointer items-center gap-1 rounded border border-nfl-red/15 bg-nfl-red/[0.04] px-2 text-[11px] font-semibold text-nfl-red/60 transition-all duration-100 hover:border-nfl-red/25 hover:bg-nfl-red/[0.08] hover:text-nfl-red/80"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
