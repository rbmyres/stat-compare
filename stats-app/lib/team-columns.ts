import type { TeamStats } from "@/lib/types/team-stats";
import { fmt, dec, pct, epa, num } from "@/lib/utils/format";

export type TeamColumnDef = {
  label: string;
  key: keyof TeamStats;
  format: (value: unknown) => string;
};

// ── OFFENSIVE PASSING ────────────────────────────────────────────────

export const OFF_PASSING_COLUMNS: TeamColumnDef[] = [
  { label: "Att", key: "off_pass_attempts", format: fmt },
  { label: "Comp", key: "off_pass_completions", format: fmt },
  { label: "Yards", key: "off_pass_yards", format: fmt },
  { label: "TD", key: "off_pass_touchdowns", format: fmt },
  { label: "INT", key: "off_pass_ints", format: fmt },
  { label: "Comp %", key: "off_pass_comp_percent", format: pct },
  { label: "Yds/Game", key: "off_pass_yards_per_game", format: (v) => dec(v) },
  { label: "Sacks", key: "off_pass_sacks", format: fmt },
  { label: "Sack Yds", key: "off_pass_sack_yards", format: fmt },
  { label: "QB Hits", key: "off_pass_qb_hit", format: fmt },
  { label: "Dropbacks", key: "off_pass_dropbacks", format: fmt },
  { label: "1st Downs", key: "off_pass_first_downs", format: fmt },
  { label: "20+", key: "off_pass_20_plus", format: fmt },
  { label: "Air Yds", key: "off_pass_air_yards", format: fmt },
  { label: "YAC", key: "off_pass_yac_total", format: fmt },
];

export const OFF_ADV_PASSING_COLUMNS: TeamColumnDef[] = [
  { label: "EPA", key: "off_pass_epa", format: epa },
  { label: "EPA/Att", key: "off_pass_epa_per_attempt", format: epa },
  { label: "EPA/Comp", key: "off_pass_epa_per_completion", format: epa },
  { label: "EPA/Drop", key: "off_pass_epa_per_dropback", format: epa },
  { label: "Success", key: "off_pass_success_total", format: fmt },
  { label: "Success %", key: "off_pass_success_rate", format: pct },
  { label: "Sack %", key: "off_pass_sack_percent", format: pct },
  { label: "QB Hit %", key: "off_pass_qb_hit_percent", format: pct },
  { label: "20+ %", key: "off_pass_20_plus_rate", format: pct },
  { label: "aDOT", key: "off_pass_average_depth_of_target", format: (v) => dec(v) },
  { label: "Air Yds/Att", key: "off_pass_air_yards_per_attempt", format: (v) => dec(v) },
  { label: "Air Yds/Comp", key: "off_pass_air_yards_per_completion", format: (v) => dec(v) },
  { label: "YAC/Att", key: "off_pass_yac_per_attempt", format: (v) => dec(v) },
  { label: "YAC/Comp", key: "off_pass_yac_per_completion", format: (v) => dec(v) },
];

// ── OFFENSIVE RUSHING ────────────────────────────────────────────────

export const OFF_RUSHING_COLUMNS: TeamColumnDef[] = [
  { label: "Att", key: "off_rush_attempts", format: fmt },
  { label: "Yards", key: "off_rush_yards", format: fmt },
  { label: "TD", key: "off_rush_touchdowns", format: fmt },
  { label: "Yds/Carry", key: "off_rush_yards_per_carry", format: (v) => dec(v) },
  { label: "Yds/Game", key: "off_rush_yards_per_game", format: (v) => dec(v) },
  { label: "1st Downs", key: "off_rush_first_downs", format: fmt },
  { label: "Stuffs", key: "off_rush_stuffs", format: fmt },
  { label: "10+", key: "off_rush_10_plus", format: fmt },
  { label: "20+", key: "off_rush_20_plus", format: fmt },
];

export const OFF_ADV_RUSHING_COLUMNS: TeamColumnDef[] = [
  { label: "EPA", key: "off_rush_epa_total", format: epa },
  { label: "EPA/Att", key: "off_rush_epa_per_attempt", format: epa },
  { label: "Success", key: "off_rush_success_total", format: fmt },
  { label: "Success %", key: "off_rush_success_rate", format: pct },
  { label: "TD %", key: "off_rush_touchdown_rate", format: pct },
  { label: "Stuff %", key: "off_rush_stuff_rate", format: pct },
  { label: "10+ %", key: "off_rush_10_plus_rate", format: pct },
  { label: "20+ %", key: "off_rush_20_plus_rate", format: pct },
];

// ── OFFENSIVE TOTAL ──────────────────────────────────────────────────

export const OFF_TOTAL_COLUMNS: TeamColumnDef[] = [
  { label: "Games", key: "games_played", format: fmt },
  { label: "Record", key: "record", format: (v) => String(v ?? "") },
  { label: "Win %", key: "win_percentage", format: (v) => pct(num(v) * 100) },
  { label: "Plays", key: "off_plays_total", format: fmt },
  { label: "Drives", key: "off_drives_total", format: fmt },
  { label: "Yards", key: "off_yards_total", format: fmt },
  { label: "Points", key: "off_points_total", format: fmt },
  { label: "TD", key: "off_touchdowns", format: fmt },
  { label: "1st Downs", key: "off_first_downs", format: fmt },
  { label: "Fumbles", key: "off_fumbles", format: fmt },
  { label: "Fum Lost", key: "off_fumbles_lost", format: fmt },
  { label: "Turnovers", key: "off_turnovers", format: fmt },
  { label: "Explosive", key: "off_explosive_plays", format: fmt },
  { label: "Yds/Game", key: "off_yards_per_game", format: (v) => dec(v) },
  { label: "Yds/Play", key: "off_yards_per_play", format: (v) => dec(v) },
  { label: "Yds/Drive", key: "off_yards_per_drive", format: (v) => dec(v) },
  { label: "Pts/Game", key: "off_points_per_game", format: (v) => dec(v) },
  { label: "Pts/Play", key: "off_points_per_play", format: (v) => dec(v, 2) },
  { label: "Pts/Drive", key: "off_points_per_drive", format: (v) => dec(v) },
  { label: "EPA", key: "off_epa", format: epa },
  { label: "EPA/Game", key: "off_epa_per_game", format: epa },
  { label: "EPA/Play", key: "off_epa_per_play", format: epa },
  { label: "EPA/Drive", key: "off_epa_per_drive", format: epa },
  { label: "Success", key: "off_success_total", format: fmt },
  { label: "Success %", key: "off_success_rate", format: pct },
  { label: "Explosive %", key: "off_explosive_play_rate", format: pct },
];

// ── OFFENSIVE SITUATIONAL ────────────────────────────────────────────

export const OFF_SITUATIONAL_COLUMNS: TeamColumnDef[] = [
  { label: "3rd Down Att", key: "off_third_down_attempts", format: fmt },
  { label: "3rd Down Conv", key: "off_third_down_conversions", format: fmt },
  { label: "3rd Down %", key: "off_third_down_conversion_rate", format: pct },
  { label: "4th Down Att", key: "off_fourth_down_attempts", format: fmt },
  { label: "4th Down Conv", key: "off_fourth_down_conversions", format: fmt },
  { label: "4th Down %", key: "off_fourth_down_conversion_rate", format: pct },
  { label: "3-and-Outs", key: "off_three_and_outs", format: fmt },
  { label: "3-and-Out %", key: "off_three_and_out_rate", format: pct },
  { label: "Early Down Plays", key: "off_early_down_total", format: fmt },
  { label: "Early Down EPA", key: "off_early_down_epa", format: epa },
  { label: "Early Down EPA/Play", key: "off_early_down_epa_per_play", format: epa },
  { label: "Early Down Success", key: "off_early_down_success", format: fmt },
  { label: "Early Down Success %", key: "off_early_down_success_rate", format: pct },
  { label: "Late Down Plays", key: "off_late_down_total", format: fmt },
  { label: "Late Down EPA", key: "off_late_down_epa", format: epa },
  { label: "Late Down EPA/Play", key: "off_late_down_epa_per_play", format: epa },
  { label: "Late Down Success", key: "off_late_down_success", format: fmt },
  { label: "Late Down Success %", key: "off_late_down_success_rate", format: pct },
];

// ── DEFENSIVE PASSING ────────────────────────────────────────────────

export const DEF_PASSING_COLUMNS: TeamColumnDef[] = [
  { label: "Att", key: "def_pass_attempts", format: fmt },
  { label: "Comp", key: "def_pass_completions", format: fmt },
  { label: "Yards", key: "def_pass_yards", format: fmt },
  { label: "TD", key: "def_pass_touchdowns", format: fmt },
  { label: "INT", key: "def_pass_ints", format: fmt },
  { label: "Comp %", key: "def_pass_comp_percent", format: pct },
  { label: "Yds/Game", key: "def_pass_yards_per_game", format: (v) => dec(v) },
  { label: "Sacks", key: "def_pass_sacks", format: fmt },
  { label: "Sack Yds", key: "def_pass_sack_yards", format: fmt },
  { label: "QB Hits", key: "def_pass_qb_hit", format: fmt },
  { label: "Dropbacks", key: "def_pass_dropbacks", format: fmt },
  { label: "1st Downs", key: "def_pass_first_downs", format: fmt },
  { label: "20+", key: "def_pass_20_plus", format: fmt },
  { label: "Air Yds", key: "def_pass_air_yards", format: fmt },
  { label: "YAC", key: "def_pass_yac_total", format: fmt },
];

export const DEF_ADV_PASSING_COLUMNS: TeamColumnDef[] = [
  { label: "EPA", key: "def_pass_epa", format: epa },
  { label: "EPA/Att", key: "def_pass_epa_per_attempt", format: epa },
  { label: "EPA/Comp", key: "def_pass_epa_per_completion", format: epa },
  { label: "EPA/Drop", key: "def_pass_epa_per_dropback", format: epa },
  { label: "Success", key: "def_pass_success_total", format: fmt },
  { label: "Success %", key: "def_pass_success_rate", format: pct },
  { label: "Sack %", key: "def_pass_sack_percent", format: pct },
  { label: "QB Hit %", key: "def_pass_qb_hit_percent", format: pct },
  { label: "20+ %", key: "def_pass_20_plus_rate", format: pct },
  { label: "aDOT", key: "def_pass_average_depth_of_target", format: (v) => dec(v) },
  { label: "Air Yds/Att", key: "def_pass_air_yards_per_attempt", format: (v) => dec(v) },
  { label: "Air Yds/Comp", key: "def_pass_air_yards_per_completion", format: (v) => dec(v) },
  { label: "YAC/Att", key: "def_pass_yac_per_attempt", format: (v) => dec(v) },
  { label: "YAC/Comp", key: "def_pass_yac_per_completion", format: (v) => dec(v) },
];

// ── DEFENSIVE RUSHING ────────────────────────────────────────────────

export const DEF_RUSHING_COLUMNS: TeamColumnDef[] = [
  { label: "Att", key: "def_rush_attempts", format: fmt },
  { label: "Yards", key: "def_rush_yards", format: fmt },
  { label: "TD", key: "def_rush_touchdowns", format: fmt },
  { label: "Yds/Carry", key: "def_rush_yards_per_carry", format: (v) => dec(v) },
  { label: "Yds/Game", key: "def_rush_yards_per_game", format: (v) => dec(v) },
  { label: "1st Downs", key: "def_rush_first_downs", format: fmt },
  { label: "Stuffs", key: "def_rush_stuffs", format: fmt },
  { label: "10+", key: "def_rush_10_plus", format: fmt },
  { label: "20+", key: "def_rush_20_plus", format: fmt },
];

export const DEF_ADV_RUSHING_COLUMNS: TeamColumnDef[] = [
  { label: "EPA", key: "def_rush_epa_total", format: epa },
  { label: "EPA/Att", key: "def_rush_epa_per_attempt", format: epa },
  { label: "Success", key: "def_rush_success_total", format: fmt },
  { label: "Success %", key: "def_rush_success_rate", format: pct },
  { label: "TD %", key: "def_rush_touchdown_rate", format: pct },
  { label: "Stuff %", key: "def_rush_stuff_rate", format: pct },
  { label: "10+ %", key: "def_rush_10_plus_rate", format: pct },
  { label: "20+ %", key: "def_rush_20_plus_rate", format: pct },
];

// ── DEFENSIVE TOTAL ──────────────────────────────────────────────────

export const DEF_TOTAL_COLUMNS: TeamColumnDef[] = [
  { label: "Plays", key: "def_plays_total", format: fmt },
  { label: "Drives", key: "def_drives_total", format: fmt },
  { label: "Yards", key: "def_yards_total", format: fmt },
  { label: "Points", key: "def_points_total", format: fmt },
  { label: "TD", key: "def_touchdowns", format: fmt },
  { label: "1st Downs", key: "def_first_downs", format: fmt },
  { label: "Fumbles", key: "def_fumbles", format: fmt },
  { label: "Fum Lost", key: "def_fumbles_lost", format: fmt },
  { label: "Turnovers", key: "def_turnovers", format: fmt },
  { label: "Explosive", key: "def_explosive_plays", format: fmt },
  { label: "Yds/Game", key: "def_yards_per_game", format: (v) => dec(v) },
  { label: "Yds/Play", key: "def_yards_per_play", format: (v) => dec(v) },
  { label: "Yds/Drive", key: "def_yards_per_drive", format: (v) => dec(v) },
  { label: "Pts/Game", key: "def_points_per_game", format: (v) => dec(v) },
  { label: "Pts/Play", key: "def_points_per_play", format: (v) => dec(v, 2) },
  { label: "Pts/Drive", key: "def_points_per_drive", format: (v) => dec(v) },
  { label: "EPA", key: "def_epa", format: epa },
  { label: "EPA/Game", key: "def_epa_per_game", format: epa },
  { label: "EPA/Play", key: "def_epa_per_play", format: epa },
  { label: "EPA/Drive", key: "def_epa_per_drive", format: epa },
  { label: "Success", key: "def_success_total", format: fmt },
  { label: "Success %", key: "def_success_rate", format: pct },
  { label: "Explosive %", key: "def_explosive_play_rate", format: pct },
];

// ── DEFENSIVE SITUATIONAL ────────────────────────────────────────────

export const DEF_SITUATIONAL_COLUMNS: TeamColumnDef[] = [
  { label: "3rd Down Att", key: "def_third_down_attempts", format: fmt },
  { label: "3rd Down Conv", key: "def_third_down_conversions", format: fmt },
  { label: "3rd Down %", key: "def_third_down_conversion_rate", format: pct },
  { label: "4th Down Att", key: "def_fourth_down_attempts", format: fmt },
  { label: "4th Down Conv", key: "def_fourth_down_conversions", format: fmt },
  { label: "4th Down %", key: "def_fourth_down_conversion_rate", format: pct },
  { label: "3-and-Outs", key: "def_three_and_outs", format: fmt },
  { label: "3-and-Out %", key: "def_three_and_out_rate", format: pct },
  { label: "Early Down Plays", key: "def_early_down_total", format: fmt },
  { label: "Early Down EPA", key: "def_early_down_epa", format: epa },
  { label: "Early Down EPA/Play", key: "def_early_down_epa_per_play", format: epa },
  { label: "Early Down Success", key: "def_early_down_success", format: fmt },
  { label: "Early Down Success %", key: "def_early_down_success_rate", format: pct },
  { label: "Late Down Plays", key: "def_late_down_total", format: fmt },
  { label: "Late Down EPA", key: "def_late_down_epa", format: epa },
  { label: "Late Down EPA/Play", key: "def_late_down_epa_per_play", format: epa },
  { label: "Late Down Success", key: "def_late_down_success", format: fmt },
  { label: "Late Down Success %", key: "def_late_down_success_rate", format: pct },
];
