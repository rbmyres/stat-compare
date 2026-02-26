import { GLOSSARY_CATEGORIES } from "@/lib/stat-definitions";
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
import type { CompareMode } from "@/lib/filters/compare-params";

export interface CompareCategory {
  title: string;
  stats: string[];
}

// Player categories: derived from glossary, excluding team-only categories
const TEAM_ONLY_TITLES = ["Team Overview", "Team Efficiency", "Situational"];

export const PLAYER_COMPARE_CATEGORIES: CompareCategory[] =
  GLOSSARY_CATEGORIES.filter((c) => !TEAM_ONLY_TITLES.includes(c.title)).map(
    ({ title, stats }) => ({ title, stats })
  );

// Team categories: derived from column definition arrays (keys already have off_/def_ prefixes)
export const TEAM_COMPARE_CATEGORIES: CompareCategory[] = [
  {
    title: "Overview (Off)",
    stats: OFF_OVERVIEW_COLUMNS.map((c) => c.key),
  },
  {
    title: "Efficiency (Off)",
    stats: OFF_EFFICIENCY_COLUMNS.map((c) => c.key),
  },
  {
    title: "Passing (Off)",
    stats: OFF_PASSING_COLUMNS.map((c) => c.key),
  },
  {
    title: "Adv Passing (Off)",
    stats: OFF_ADV_PASSING_COLUMNS.map((c) => c.key),
  },
  {
    title: "Rushing (Off)",
    stats: OFF_RUSHING_COLUMNS.map((c) => c.key),
  },
  {
    title: "Adv Rushing (Off)",
    stats: OFF_ADV_RUSHING_COLUMNS.map((c) => c.key),
  },
  {
    title: "Situational (Off)",
    stats: OFF_SITUATIONAL_COLUMNS.map((c) => c.key),
  },
  {
    title: "Overview (Def)",
    stats: DEF_OVERVIEW_COLUMNS.map((c) => c.key),
  },
  {
    title: "Efficiency (Def)",
    stats: DEF_EFFICIENCY_COLUMNS.map((c) => c.key),
  },
  {
    title: "Passing (Def)",
    stats: DEF_PASSING_COLUMNS.map((c) => c.key),
  },
  {
    title: "Adv Passing (Def)",
    stats: DEF_ADV_PASSING_COLUMNS.map((c) => c.key),
  },
  {
    title: "Rushing (Def)",
    stats: DEF_RUSHING_COLUMNS.map((c) => c.key),
  },
  {
    title: "Adv Rushing (Def)",
    stats: DEF_ADV_RUSHING_COLUMNS.map((c) => c.key),
  },
  {
    title: "Situational (Def)",
    stats: DEF_SITUATIONAL_COLUMNS.map((c) => c.key),
  },
];

export function getCompareCategories(mode: CompareMode): CompareCategory[] {
  return mode === "player"
    ? PLAYER_COMPARE_CATEGORIES
    : TEAM_COMPARE_CATEGORIES;
}

/** Stats where lower values are better (for best-value highlighting). */
export const LOWER_IS_BETTER = new Set([
  // Player
  "pass_ints",
  "pass_sacks",
  "pass_sack_yards",
  "pass_int_percent",
  "pass_sack_percent",
  "pass_qb_hit_percent",
  "rush_stuffs",
  "rush_stuff_rate",
  "rush_fumbles",
  "rush_fumbles_lost",
  "rec_fumbles",
  "rec_fumbles_lost",
  "total_fumbles",
  "total_fumbles_lost",
  // Team offensive (lower = worse for offense, but these are negative stats)
  "off_pass_sacks",
  "off_pass_sack_yards",
  "off_pass_sack_percent",
  "off_pass_qb_hit_percent",
  "off_rush_stuffs",
  "off_rush_stuff_rate",
  "off_fumbles",
  "off_fumbles_lost",
  "off_turnovers",
  "off_three_and_outs",
  "off_three_and_out_rate",
  // Team defensive (lower = better for defense)
  "def_pass_yards",
  "def_pass_touchdowns",
  "def_pass_completions",
  "def_pass_comp_percent",
  "def_pass_yards_per_game",
  "def_pass_20_plus",
  "def_pass_20_plus_rate",
  "def_pass_first_downs",
  "def_rush_yards",
  "def_rush_touchdowns",
  "def_rush_yards_per_carry",
  "def_rush_yards_per_game",
  "def_rush_first_downs",
  "def_rush_10_plus",
  "def_rush_10_plus_rate",
  "def_rush_20_plus",
  "def_rush_20_plus_rate",
  "def_yards_total",
  "def_points_total",
  "def_touchdowns",
  "def_first_downs",
  "def_yards_per_game",
  "def_yards_per_play",
  "def_yards_per_drive",
  "def_points_per_game",
  "def_points_per_play",
  "def_points_per_drive",
  "def_explosive_plays",
  "def_explosive_play_rate",
  "def_success_total",
  "def_success_rate",
  "def_third_down_conversions",
  "def_third_down_conversion_rate",
  "def_fourth_down_conversions",
  "def_fourth_down_conversion_rate",
]);
