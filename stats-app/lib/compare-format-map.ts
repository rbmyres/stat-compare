import {
  PASSING_COLUMNS,
  ADV_PASSING_COLUMNS,
  RUSHING_COLUMNS,
  ADV_RUSHING_COLUMNS,
  SCRAMBLING_COLUMNS,
  RECEIVING_COLUMNS,
  ADV_RECEIVING_COLUMNS,
  OVERVIEW_COLUMNS,
  SCRIMMAGE_FANTASY_COLUMNS,
} from "@/lib/columns";
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
import { fmt } from "@/lib/utils/format";
import type { CompareMode } from "@/lib/filters/compare-params";

// Build flat key → format maps from column definition arrays

const PLAYER_FORMAT_MAP: Record<string, (v: unknown) => string> = {};
for (const col of [
  ...PASSING_COLUMNS,
  ...ADV_PASSING_COLUMNS,
  ...RUSHING_COLUMNS,
  ...ADV_RUSHING_COLUMNS,
  ...SCRAMBLING_COLUMNS,
  ...RECEIVING_COLUMNS,
  ...ADV_RECEIVING_COLUMNS,
  ...OVERVIEW_COLUMNS,
  ...SCRIMMAGE_FANTASY_COLUMNS,
]) {
  PLAYER_FORMAT_MAP[col.key] = col.format;
}

const TEAM_FORMAT_MAP: Record<string, (v: unknown) => string> = {};
for (const col of [
  ...OFF_PASSING_COLUMNS,
  ...OFF_ADV_PASSING_COLUMNS,
  ...OFF_RUSHING_COLUMNS,
  ...OFF_ADV_RUSHING_COLUMNS,
  ...OFF_OVERVIEW_COLUMNS,
  ...OFF_EFFICIENCY_COLUMNS,
  ...OFF_SITUATIONAL_COLUMNS,
  ...DEF_PASSING_COLUMNS,
  ...DEF_ADV_PASSING_COLUMNS,
  ...DEF_RUSHING_COLUMNS,
  ...DEF_ADV_RUSHING_COLUMNS,
  ...DEF_OVERVIEW_COLUMNS,
  ...DEF_EFFICIENCY_COLUMNS,
  ...DEF_SITUATIONAL_COLUMNS,
]) {
  TEAM_FORMAT_MAP[col.key] = col.format;
}

/** Look up the correct formatter for a stat key and apply it. */
export function formatStatValue(
  key: string,
  value: unknown,
  mode: CompareMode
): string {
  const map = mode === "player" ? PLAYER_FORMAT_MAP : TEAM_FORMAT_MAP;
  const formatter = map[key] ?? fmt;
  return formatter(value);
}
