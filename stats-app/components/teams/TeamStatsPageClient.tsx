"use client";

import { useState } from "react";
import type { TeamStats } from "@/lib/types/team-stats";
import type { TeamColumnDef } from "@/lib/team-columns";
import {
  OFF_PASSING_COLUMNS,
  OFF_ADV_PASSING_COLUMNS,
  OFF_RUSHING_COLUMNS,
  OFF_ADV_RUSHING_COLUMNS,
  OFF_OVERVIEW_COLUMNS,
  OFF_EFFICIENCY_COLUMNS,
  OFF_SITUATIONAL_COLUMNS,
  DEF_PASSING_COLUMNS,
  DEF_ADV_PASSING_COLUMNS,
  DEF_RUSHING_COLUMNS,
  DEF_ADV_RUSHING_COLUMNS,
  DEF_OVERVIEW_COLUMNS,
  DEF_EFFICIENCY_COLUMNS,
  DEF_SITUATIONAL_COLUMNS,
} from "@/lib/team-columns";
import { SortableTeamTable } from "./SortableTeamTable";
import { OffDefToggle } from "./OffDefToggle";
import { BasicAdvancedToggle } from "@/components/players/BasicAdvancedToggle";

export type TeamStatCategory = "passing" | "rushing" | "overview" | "situational";

type ColumnSet = {
  basic: TeamColumnDef[];
  advanced?: TeamColumnDef[];
};

const COLUMN_MAP: Record<TeamStatCategory, { offense: ColumnSet; defense: ColumnSet }> = {
  passing: {
    offense: { basic: OFF_PASSING_COLUMNS, advanced: OFF_ADV_PASSING_COLUMNS },
    defense: { basic: DEF_PASSING_COLUMNS, advanced: DEF_ADV_PASSING_COLUMNS },
  },
  rushing: {
    offense: { basic: OFF_RUSHING_COLUMNS, advanced: OFF_ADV_RUSHING_COLUMNS },
    defense: { basic: DEF_RUSHING_COLUMNS, advanced: DEF_ADV_RUSHING_COLUMNS },
  },
  overview: {
    offense: { basic: OFF_OVERVIEW_COLUMNS, advanced: OFF_EFFICIENCY_COLUMNS },
    defense: { basic: DEF_OVERVIEW_COLUMNS, advanced: DEF_EFFICIENCY_COLUMNS },
  },
  situational: {
    offense: { basic: OFF_SITUATIONAL_COLUMNS },
    defense: { basic: DEF_SITUATIONAL_COLUMNS },
  },
};

interface TeamStatsPageClientProps {
  teams: TeamStats[];
  title: string;
  category: TeamStatCategory;
}

export function TeamStatsPageClient({
  teams,
  title,
  category,
}: TeamStatsPageClientProps) {
  const [side, setSide] = useState<"offense" | "defense">("offense");
  const [view, setView] = useState<"basic" | "advanced">("basic");

  const columnSet = COLUMN_MAP[category][side];
  const hasAdvanced = !!columnSet.advanced;
  const columns =
    view === "advanced" && hasAdvanced ? columnSet.advanced! : columnSet.basic;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-foreground/50">
            {teams.length} team{teams.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <OffDefToggle value={side} onChange={setSide} />
          {hasAdvanced && (
            <BasicAdvancedToggle value={view} onChange={setView} />
          )}
        </div>
      </div>
      {teams.length > 0 ? (
        <SortableTeamTable teams={teams} columns={columns} />
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
