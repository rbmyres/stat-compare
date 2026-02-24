import type { PlayerStats } from "@/lib/types/player-stats";
import { fmt, dec, pct, epa, num } from "@/lib/utils/format";

export type ColumnDef = {
  label: string;
  key: keyof PlayerStats;
  format: (value: unknown) => string;
};

// ── PASSING ──────────────────────────────────────────────────────────

export const PASSING_COLUMNS: ColumnDef[] = [
  { label: "Att", key: "pass_attempts", format: fmt },
  { label: "Comp", key: "pass_completions", format: fmt },
  { label: "Yards", key: "pass_yards", format: fmt },
  { label: "TD", key: "pass_touchdowns", format: fmt },
  { label: "INT", key: "pass_ints", format: fmt },
  { label: "Rating", key: "pass_rating", format: (v) => dec(v) },
  { label: "Comp %", key: "pass_comp_percent", format: pct },
  { label: "Yds/Att", key: "pass_yards_per_attempt", format: (v) => dec(v) },
  { label: "Yds/Comp", key: "pass_yards_per_completion", format: (v) => dec(v) },
  { label: "Yds/Game", key: "pass_yards_per_game", format: (v) => dec(v) },
  { label: "Sacks", key: "pass_sacks", format: fmt },
  { label: "Sack Yds", key: "pass_sack_yards", format: fmt },
  { label: "QB Hits", key: "pass_qb_hit", format: fmt },
  { label: "Dropbacks", key: "pass_qb_dropbacks", format: fmt },
  { label: "1st Downs", key: "pass_first_downs", format: fmt },
  { label: "20+", key: "pass_20_plus", format: fmt },
  { label: "Long", key: "pass_long", format: fmt },
  { label: "Air Yds", key: "pass_air_yards", format: fmt },
  { label: "YAC", key: "pass_yac_total", format: fmt },
];

export const ADV_PASSING_COLUMNS: ColumnDef[] = [
  { label: "EPA", key: "pass_epa", format: epa },
  { label: "EPA/Att", key: "pass_epa_per_attempt", format: epa },
  { label: "EPA/Comp", key: "pass_epa_per_completion", format: epa },
  { label: "EPA/Dropback", key: "pass_epa_per_dropback", format: epa },
  { label: "CPOE", key: "pass_cpoe", format: epa },
  { label: "CPOE Total", key: "pass_cpoe_total", format: (v) => dec(v, 2) },
  { label: "Success", key: "pass_success_total", format: fmt },
  { label: "Success %", key: "pass_success_rate", format: pct },
  { label: "TD %", key: "pass_td_percent", format: pct },
  { label: "INT %", key: "pass_int_percent", format: pct },
  { label: "Sack %", key: "pass_sack_percent", format: pct },
  { label: "QB Hit %", key: "pass_qb_hit_percent", format: pct },
  { label: "1st Down %", key: "pass_first_down_rate", format: pct },
  { label: "20+ %", key: "pass_20_plus_rate", format: pct },
  { label: "aDOT", key: "pass_average_depth_of_target", format: (v) => dec(v) },
  { label: "Air Yds/Att", key: "pass_air_yards_per_attempt", format: (v) => dec(v) },
  { label: "Air Yds/Comp", key: "pass_air_yards_per_completion", format: (v) => dec(v) },
  { label: "YAC/Att", key: "pass_yac_per_attempt", format: (v) => dec(v) },
  { label: "YAC/Comp", key: "pass_yac_per_completion", format: (v) => dec(v) },
];

// ── RUSHING ──────────────────────────────────────────────────────────

export const RUSHING_COLUMNS: ColumnDef[] = [
  { label: "Carries", key: "rush_attempts", format: fmt },
  { label: "Yards", key: "rush_yards", format: fmt },
  { label: "TD", key: "rush_touchdowns", format: fmt },
  { label: "Yds/Carry", key: "rush_yards_per_carry", format: (v) => dec(v) },
  { label: "Yds/Game", key: "rush_yards_per_game", format: (v) => dec(v) },
  { label: "Long", key: "rush_long", format: fmt },
  { label: "1st Downs", key: "rush_first_downs", format: fmt },
  { label: "Stuffs", key: "rush_stuffs", format: fmt },
  { label: "10+", key: "rush_10_plus", format: fmt },
  { label: "20+", key: "rush_20_plus", format: fmt },
  { label: "Fumbles", key: "rush_fumbles", format: fmt },
  { label: "Fum Lost", key: "rush_fumbles_lost", format: fmt },
];

export const ADV_RUSHING_COLUMNS: ColumnDef[] = [
  { label: "EPA", key: "rush_epa_total", format: epa },
  { label: "EPA/Att", key: "rush_epa_per_attempt", format: epa },
  { label: "Success", key: "rush_success_total", format: fmt },
  { label: "Success %", key: "rush_success_rate", format: pct },
  { label: "TD %", key: "rush_touchdown_rate", format: pct },
  { label: "Stuff %", key: "rush_stuff_rate", format: pct },
  { label: "10+ %", key: "rush_10_plus_rate", format: pct },
  { label: "20+ %", key: "rush_20_plus_rate", format: pct },
  { label: "Scramble Att", key: "qb_scramble_attempts", format: fmt },
  { label: "Scramble Yds", key: "qb_scramble_yards", format: fmt },
  { label: "Scramble TD", key: "qb_scramble_tds", format: fmt },
  { label: "Scramble Yds/Carry", key: "qb_scramble_yards_per_carry", format: (v) => dec(v) },
  { label: "Scramble Yds/Game", key: "qb_scramble_yards_per_game", format: (v) => dec(v) },
  { label: "Scramble EPA", key: "qb_scramble_epa_total", format: epa },
  { label: "Scramble EPA/Carry", key: "qb_scramble_epa_per_carry", format: epa },
  { label: "Scramble Success", key: "qb_scramble_success_total", format: fmt },
  { label: "Scramble Success %", key: "qb_scramble_success_rate", format: pct },
];

// ── RECEIVING ────────────────────────────────────────────────────────

export const RECEIVING_COLUMNS: ColumnDef[] = [
  { label: "Targets", key: "rec_targets", format: fmt },
  { label: "Rec", key: "rec_receptions", format: fmt },
  { label: "Yards", key: "rec_yards", format: fmt },
  { label: "TD", key: "rec_touchdowns", format: fmt },
  { label: "Catch %", key: "rec_catch_rate", format: pct },
  { label: "Yds/Rec", key: "rec_yards_per_reception", format: (v) => dec(v) },
  { label: "Yds/Tgt", key: "rec_yards_per_target", format: (v) => dec(v) },
  { label: "Yds/Game", key: "rec_yards_per_game", format: (v) => dec(v) },
  { label: "Long", key: "rec_long", format: fmt },
  { label: "1st Downs", key: "rec_first_downs", format: fmt },
  { label: "20+", key: "rec_20_plus", format: fmt },
  { label: "Air Yds", key: "rec_air_yards_total", format: fmt },
  { label: "YAC", key: "rec_yac_total", format: fmt },
  { label: "Fumbles", key: "rec_fumbles", format: fmt },
  { label: "Fum Lost", key: "rec_fumbles_lost", format: fmt },
];

export const ADV_RECEIVING_COLUMNS: ColumnDef[] = [
  { label: "EPA", key: "rec_epa_total", format: epa },
  { label: "EPA/Tgt", key: "rec_epa_per_target", format: epa },
  { label: "EPA/Rec", key: "rec_epa_per_reception", format: epa },
  { label: "Success", key: "rec_success_total", format: fmt },
  { label: "Success %", key: "rec_success_rate", format: pct },
  { label: "TD %", key: "rec_touchdown_rate", format: pct },
  { label: "1st Down %", key: "rec_first_down_rate", format: pct },
  { label: "20+ %", key: "rec_20_plus_rate", format: pct },
  { label: "Air Yds/Tgt", key: "rec_air_yards_per_target", format: (v) => dec(v) },
  { label: "Air Yds/Rec", key: "rec_air_yards_per_reception", format: (v) => dec(v) },
  { label: "Air Yd %", key: "rec_air_yard_percent", format: pct },
  { label: "YAC/Rec", key: "rec_yac_per_reception", format: (v) => dec(v) },
  { label: "YAC %", key: "rec_yac_percent", format: pct },
];

// ── TOTALS ───────────────────────────────────────────────────────────

export const TOTALS_COLUMNS: ColumnDef[] = [
  { label: "Games", key: "games_played", format: fmt },
  { label: "Record", key: "record", format: (v) => String(v ?? "") },
  { label: "Win %", key: "win_percentage", format: (v) => pct(num(v) * 100) },
  { label: "Total Plays", key: "total_plays", format: fmt },
  { label: "Total Yards", key: "total_yards", format: fmt },
  { label: "Total TD", key: "total_touchdowns", format: fmt },
  { label: "Total 1st Downs", key: "total_first_downs", format: fmt },
  { label: "Total Fumbles", key: "total_fumbles", format: fmt },
  { label: "Total Fum Lost", key: "total_fumbles_lost", format: fmt },
  { label: "Yds/Play", key: "total_yards_per_play", format: (v) => dec(v) },
  { label: "Yds/Game", key: "total_yards_per_game", format: (v) => dec(v) },
  { label: "Total EPA", key: "total_epa", format: epa },
  { label: "EPA/Play", key: "total_epa_per_play", format: epa },
  { label: "Success Plays", key: "total_success_plays", format: fmt },
  { label: "Success %", key: "total_success_rate", format: pct },
  { label: "Scrim Touches", key: "scrim_touches", format: fmt },
  { label: "Scrim Yards", key: "scrim_yards", format: fmt },
  { label: "Scrim TD", key: "scrim_touchdowns", format: fmt },
  { label: "Scrim 1st Downs", key: "scrim_first_downs", format: fmt },
  { label: "Scrim Yds/Touch", key: "scrim_yards_per_touch", format: (v) => dec(v) },
  { label: "Scrim Yds/Game", key: "scrim_yards_per_game", format: (v) => dec(v) },
  { label: "Scrim EPA", key: "scrim_epa_total", format: epa },
  { label: "Scrim EPA/Play", key: "scrim_epa_per_play", format: epa },
  { label: "Scrim Success", key: "scrim_success_total", format: fmt },
  { label: "Scrim Success %", key: "scrim_success_rate", format: pct },
  { label: "PPR Points", key: "ppr_points", format: (v) => dec(v) },
];
