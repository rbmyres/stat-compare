"use client";

import { useState } from "react";
import type { PlayerStats } from "@/lib/types/player-stats";
import {
  PASSING_COLUMNS,
  ADV_PASSING_COLUMNS,
  RUSHING_COLUMNS,
  ADV_RUSHING_COLUMNS,
  RECEIVING_COLUMNS,
  ADV_RECEIVING_COLUMNS,
  TOTALS_COLUMNS,
} from "@/lib/columns";
import { SortableStatsTable } from "./SortableStatsTable";
import { BasicAdvancedToggle } from "./BasicAdvancedToggle";

export type StatCategory = "passing" | "rushing" | "receiving" | "totals";

const COLUMN_MAP = {
  passing: { basic: PASSING_COLUMNS, advanced: ADV_PASSING_COLUMNS },
  rushing: { basic: RUSHING_COLUMNS, advanced: ADV_RUSHING_COLUMNS },
  receiving: { basic: RECEIVING_COLUMNS, advanced: ADV_RECEIVING_COLUMNS },
  totals: { basic: TOTALS_COLUMNS },
} as const;

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
  const config = COLUMN_MAP[category];
  const hasAdvanced = "advanced" in config;
  const columns = view === "advanced" && hasAdvanced
    ? (config as { basic: typeof config.basic; advanced: typeof config.basic }).advanced
    : config.basic;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-foreground/50">
            {players.length} player{players.length !== 1 ? "s" : ""}
          </p>
        </div>
        {hasAdvanced && (
          <BasicAdvancedToggle value={view} onChange={setView} />
        )}
      </div>
      {players.length > 0 ? (
        <SortableStatsTable players={players} columns={columns} />
      ) : (
        <div className="rounded-lg border border-foreground/10 p-6">
          <p className="text-foreground/50">
            No stats found for the selected date range.
          </p>
        </div>
      )}
    </div>
  );
}
