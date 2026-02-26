"use client";

import { useState, useMemo } from "react";
import type { PlayerStats } from "@/lib/types/player-stats";
import {
  PASSING_COLUMNS,
  ADV_PASSING_COLUMNS,
  RUSHING_COLUMNS,
  ADV_RUSHING_COLUMNS,
  RECEIVING_COLUMNS,
  ADV_RECEIVING_COLUMNS,
  OVERVIEW_COLUMNS,
  SCRIMMAGE_FANTASY_COLUMNS,
} from "@/lib/columns";
import { SortableStatsTable } from "./SortableStatsTable";
import { BasicAdvancedToggle } from "./BasicAdvancedToggle";
import { PositionFilter, POSITIONS, type Position } from "./PositionFilter";
import { MinimumFilter } from "./MinimumFilter";

export type StatCategory = "passing" | "rushing" | "receiving" | "overview";

const COLUMN_MAP = {
  passing: { basic: PASSING_COLUMNS, advanced: ADV_PASSING_COLUMNS },
  rushing: { basic: RUSHING_COLUMNS, advanced: ADV_RUSHING_COLUMNS },
  receiving: { basic: RECEIVING_COLUMNS, advanced: ADV_RECEIVING_COLUMNS },
  overview: { basic: OVERVIEW_COLUMNS, advanced: SCRIMMAGE_FANTASY_COLUMNS },
} as const;

const DEFAULT_SORT: Record<StatCategory, keyof PlayerStats> = {
  passing: "pass_yards",
  rushing: "rush_yards",
  receiving: "rec_yards",
  overview: "total_yards",
};

const MIN_FILTER_CONFIG: Record<StatCategory, { label: string; key: keyof PlayerStats } | null> = {
  passing: { label: "Min Att", key: "pass_attempts" },
  rushing: { label: "Min Carries", key: "rush_attempts" },
  receiving: { label: "Min Targets", key: "rec_targets" },
  overview: { label: "Min Plays", key: "total_plays" },
};

interface StatsPageClientProps {
  players: PlayerStats[];
  title: string;
  category: StatCategory;
}

export function StatsPageClient({
  players,
  title,
  category,
}: StatsPageClientProps) {
  const [view, setView] = useState<"basic" | "advanced">("basic");
  const [positions, setPositions] = useState<Set<Position>>(() => new Set(POSITIONS));
  const [minimum, setMinimum] = useState(0);

  const config = COLUMN_MAP[category];
  const hasAdvanced = "advanced" in config;
  const columns = view === "advanced" && hasAdvanced
    ? (config as { basic: typeof config.basic; advanced: typeof config.basic }).advanced
    : config.basic;

  const minConfig = MIN_FILTER_CONFIG[category];
  const allPositions = positions.size === POSITIONS.length;

  const filtered = useMemo(() => {
    let result = players;

    // Position filter
    if (!allPositions) {
      result = result.filter((p) => positions.has(p.position as Position));
    }

    // Minimum threshold filter
    if (minimum > 0 && minConfig) {
      result = result.filter((p) => Number(p[minConfig.key]) >= minimum);
    }

    return result;
  }, [players, positions, allPositions, minimum, minConfig]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-foreground/50">
            {filtered.length} player{filtered.length !== 1 ? "s" : ""}
            {filtered.length !== players.length && (
              <span className="text-foreground/30">
                {" "}(of {players.length})
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <PositionFilter selected={positions} onChange={setPositions} />
          {minConfig && (
            <MinimumFilter
              label={minConfig.label}
              value={minimum}
              onChange={setMinimum}
            />
          )}
          {hasAdvanced && (
            <BasicAdvancedToggle value={view} onChange={setView} />
          )}
        </div>
      </div>
      {filtered.length > 0 ? (
        <SortableStatsTable players={filtered} columns={columns} defaultSortKey={DEFAULT_SORT[category]} />
      ) : (
        <div className="rounded-lg border border-foreground/10 p-6 text-center">
          <p className="text-foreground/50">
            No stats found for the selected filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setPositions(new Set(POSITIONS));
              setMinimum(0);
            }}
            className="mt-3 text-sm font-medium text-nfl-navy hover:underline"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}
