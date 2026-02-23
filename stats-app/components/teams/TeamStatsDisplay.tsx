import type { TeamStats } from "@/lib/types/team-stats";
import { num, fmt, dec, pct, epa } from "@/lib/utils/format";
import { StatSection } from "@/components/players/StatSection";

interface TeamStatsDisplayProps {
  stats: TeamStats;
}

type Stat = { label: string; value: string };

// ── OFFENSIVE PASSING ────────────────────────────────────────────────

function buildOffPassing(s: TeamStats): Stat[] {
  return [
    { label: "Att", value: fmt(s.off_pass_attempts) },
    { label: "Comp", value: fmt(s.off_pass_completions) },
    { label: "Yards", value: fmt(s.off_pass_yards) },
    { label: "TD", value: fmt(s.off_pass_touchdowns) },
    { label: "INT", value: fmt(s.off_pass_ints) },
    { label: "Comp %", value: pct(s.off_pass_comp_percent) },
    { label: "Yds/Game", value: dec(s.off_pass_yards_per_game) },
    { label: "Sacks", value: fmt(s.off_pass_sacks) },
    { label: "Sack Yds", value: fmt(s.off_pass_sack_yards) },
    { label: "QB Hits", value: fmt(s.off_pass_qb_hit) },
    { label: "Dropbacks", value: fmt(s.off_pass_dropbacks) },
    { label: "1st Downs", value: fmt(s.off_pass_first_downs) },
    { label: "20+", value: fmt(s.off_pass_20_plus) },
    { label: "Air Yds", value: fmt(s.off_pass_air_yards) },
    { label: "YAC", value: fmt(s.off_pass_yac_total) },
  ];
}

function buildOffAdvPassing(s: TeamStats): Stat[] {
  return [
    { label: "EPA", value: epa(s.off_pass_epa) },
    { label: "EPA/Att", value: epa(s.off_pass_epa_per_attempt) },
    { label: "EPA/Comp", value: epa(s.off_pass_epa_per_completion) },
    { label: "EPA/Drop", value: epa(s.off_pass_epa_per_dropback) },
    { label: "WPA", value: epa(s.off_pass_wpa) },
    { label: "WPA/Att", value: epa(s.off_pass_wpa_per_attempt) },
    { label: "WPA/Comp", value: epa(s.off_pass_wpa_per_completion) },
    { label: "WPA/Drop", value: epa(s.off_pass_wpa_per_dropback) },
    { label: "Success", value: fmt(s.off_pass_success_total) },
    { label: "Success %", value: pct(s.off_pass_success_rate) },
    { label: "Sack %", value: pct(s.off_pass_sack_percent) },
    { label: "QB Hit %", value: pct(s.off_pass_qb_hit_percent) },
    { label: "20+ %", value: pct(s.off_pass_20_plus_rate) },
    { label: "aDOT", value: dec(s.off_pass_average_depth_of_target) },
    { label: "Air Yds/Att", value: dec(s.off_pass_air_yards_per_attempt) },
    { label: "Air Yds/Comp", value: dec(s.off_pass_air_yards_per_completion) },
    { label: "YAC/Att", value: dec(s.off_pass_yac_per_attempt) },
    { label: "YAC/Comp", value: dec(s.off_pass_yac_per_completion) },
  ];
}

// ── OFFENSIVE RUSHING ────────────────────────────────────────────────

function buildOffRushing(s: TeamStats): Stat[] {
  return [
    { label: "Att", value: fmt(s.off_rush_attempts) },
    { label: "Yards", value: fmt(s.off_rush_yards) },
    { label: "TD", value: fmt(s.off_rush_touchdowns) },
    { label: "Yds/Carry", value: dec(s.off_rush_yards_per_carry) },
    { label: "Yds/Game", value: dec(s.off_rush_yards_per_game) },
    { label: "1st Downs", value: fmt(s.off_rush_first_downs) },
    { label: "Stuffs", value: fmt(s.off_rush_stuffs) },
    { label: "10+", value: fmt(s.off_rush_10_plus) },
    { label: "20+", value: fmt(s.off_rush_20_plus) },
  ];
}

function buildOffAdvRushing(s: TeamStats): Stat[] {
  return [
    { label: "EPA", value: epa(s.off_rush_epa_total) },
    { label: "EPA/Att", value: epa(s.off_rush_epa_per_attempt) },
    { label: "WPA", value: epa(s.off_rush_wpa_total) },
    { label: "WPA/Att", value: epa(s.off_rush_wpa_per_attempt) },
    { label: "Success", value: fmt(s.off_rush_success_total) },
    { label: "Success %", value: pct(s.off_rush_success_rate) },
    { label: "TD %", value: pct(s.off_rush_touchdown_rate) },
    { label: "Stuff %", value: pct(s.off_rush_stuff_rate) },
    { label: "10+ %", value: pct(s.off_rush_10_plus_rate) },
    { label: "20+ %", value: pct(s.off_rush_20_plus_rate) },
  ];
}

// ── OFFENSIVE TOTAL ──────────────────────────────────────────────────

function buildOffTotal(s: TeamStats): Stat[] {
  return [
    { label: "Games", value: fmt(s.games_played) },
    { label: "Record", value: s.record },
    { label: "Win %", value: pct(num(s.win_percentage) * 100) },
    { label: "Plays", value: fmt(s.off_plays_total) },
    { label: "Drives", value: fmt(s.off_drives_total) },
    { label: "Yards", value: fmt(s.off_yards_total) },
    { label: "Points", value: fmt(s.off_points_total) },
    { label: "TD", value: fmt(s.off_touchdowns) },
    { label: "1st Downs", value: fmt(s.off_first_downs) },
    { label: "Fumbles", value: fmt(s.off_fumbles) },
    { label: "Fum Lost", value: fmt(s.off_fumbles_lost) },
    { label: "Turnovers", value: fmt(s.off_turnovers) },
    { label: "Explosive", value: fmt(s.off_explosive_plays) },
    { label: "Yds/Game", value: dec(s.off_yards_per_game) },
    { label: "Yds/Play", value: dec(s.off_yards_per_play) },
    { label: "Yds/Drive", value: dec(s.off_yards_per_drive) },
    { label: "Pts/Game", value: dec(s.off_points_per_game) },
    { label: "Pts/Play", value: dec(s.off_points_per_play, 2) },
    { label: "Pts/Drive", value: dec(s.off_points_per_drive) },
    { label: "EPA", value: epa(s.off_epa) },
    { label: "EPA/Game", value: epa(s.off_epa_per_game) },
    { label: "EPA/Play", value: epa(s.off_epa_per_play) },
    { label: "EPA/Drive", value: epa(s.off_epa_per_drive) },
    { label: "WPA", value: epa(s.off_wpa) },
    { label: "WPA/Game", value: epa(s.off_wpa_per_game) },
    { label: "WPA/Play", value: epa(s.off_wpa_per_play) },
    { label: "WPA/Drive", value: epa(s.off_wpa_per_drive) },
    { label: "Success", value: fmt(s.off_success_total) },
    { label: "Success %", value: pct(s.off_success_rate) },
    { label: "Explosive %", value: pct(s.off_explosive_play_rate) },
  ];
}

// ── OFFENSIVE SITUATIONAL ────────────────────────────────────────────

function buildOffSituational(s: TeamStats): Stat[] {
  return [
    { label: "3rd Down Att", value: fmt(s.off_third_down_attempts) },
    { label: "3rd Down Conv", value: fmt(s.off_third_down_conversions) },
    { label: "3rd Down %", value: pct(s.off_third_down_conversion_rate) },
    { label: "4th Down Att", value: fmt(s.off_fourth_down_attempts) },
    { label: "4th Down Conv", value: fmt(s.off_fourth_down_conversions) },
    { label: "4th Down %", value: pct(s.off_fourth_down_conversion_rate) },
    { label: "3-and-Outs", value: fmt(s.off_three_and_outs) },
    { label: "3-and-Out %", value: pct(s.off_three_and_out_rate) },
    { label: "Early Down Plays", value: fmt(s.off_early_down_total) },
    { label: "Early Down EPA", value: epa(s.off_early_down_epa) },
    { label: "Early Down EPA/Play", value: epa(s.off_early_down_epa_per_play) },
    { label: "Early Down Success", value: fmt(s.off_early_down_success) },
    { label: "Early Down Success %", value: pct(s.off_early_down_success_rate) },
    { label: "Early Down WPA", value: epa(s.off_early_down_wpa) },
    { label: "Early Down WPA/Play", value: epa(s.off_early_down_wpa_per_play) },
    { label: "Late Down Plays", value: fmt(s.off_late_down_total) },
    { label: "Late Down EPA", value: epa(s.off_late_down_epa) },
    { label: "Late Down EPA/Play", value: epa(s.off_late_down_epa_per_play) },
    { label: "Late Down Success", value: fmt(s.off_late_down_success) },
    { label: "Late Down Success %", value: pct(s.off_late_down_success_rate) },
    { label: "Late Down WPA", value: epa(s.off_late_down_wpa) },
    { label: "Late Down WPA/Play", value: epa(s.off_late_down_wpa_per_play) },
  ];
}

// ── DEFENSIVE PASSING ────────────────────────────────────────────────

function buildDefPassing(s: TeamStats): Stat[] {
  return [
    { label: "Att", value: fmt(s.def_pass_attempts) },
    { label: "Comp", value: fmt(s.def_pass_completions) },
    { label: "Yards", value: fmt(s.def_pass_yards) },
    { label: "TD", value: fmt(s.def_pass_touchdowns) },
    { label: "INT", value: fmt(s.def_pass_ints) },
    { label: "Comp %", value: pct(s.def_pass_comp_percent) },
    { label: "Yds/Game", value: dec(s.def_pass_yards_per_game) },
    { label: "Sacks", value: fmt(s.def_pass_sacks) },
    { label: "Sack Yds", value: fmt(s.def_pass_sack_yards) },
    { label: "QB Hits", value: fmt(s.def_pass_qb_hit) },
    { label: "Dropbacks", value: fmt(s.def_pass_dropbacks) },
    { label: "1st Downs", value: fmt(s.def_pass_first_downs) },
    { label: "20+", value: fmt(s.def_pass_20_plus) },
    { label: "Air Yds", value: fmt(s.def_pass_air_yards) },
    { label: "YAC", value: fmt(s.def_pass_yac_total) },
  ];
}

function buildDefAdvPassing(s: TeamStats): Stat[] {
  return [
    { label: "EPA", value: epa(s.def_pass_epa) },
    { label: "EPA/Att", value: epa(s.def_pass_epa_per_attempt) },
    { label: "EPA/Comp", value: epa(s.def_pass_epa_per_completion) },
    { label: "EPA/Drop", value: epa(s.def_pass_epa_per_dropback) },
    { label: "WPA", value: epa(s.def_pass_wpa) },
    { label: "WPA/Att", value: epa(s.def_pass_wpa_per_attempt) },
    { label: "WPA/Comp", value: epa(s.def_pass_wpa_per_completion) },
    { label: "WPA/Drop", value: epa(s.def_pass_wpa_per_dropback) },
    { label: "Success", value: fmt(s.def_pass_success_total) },
    { label: "Success %", value: pct(s.def_pass_success_rate) },
    { label: "Sack %", value: pct(s.def_pass_sack_percent) },
    { label: "QB Hit %", value: pct(s.def_pass_qb_hit_percent) },
    { label: "20+ %", value: pct(s.def_pass_20_plus_rate) },
    { label: "aDOT", value: dec(s.def_pass_average_depth_of_target) },
    { label: "Air Yds/Att", value: dec(s.def_pass_air_yards_per_attempt) },
    { label: "Air Yds/Comp", value: dec(s.def_pass_air_yards_per_completion) },
    { label: "YAC/Att", value: dec(s.def_pass_yac_per_attempt) },
    { label: "YAC/Comp", value: dec(s.def_pass_yac_per_completion) },
  ];
}

// ── DEFENSIVE RUSHING ────────────────────────────────────────────────

function buildDefRushing(s: TeamStats): Stat[] {
  return [
    { label: "Att", value: fmt(s.def_rush_attempts) },
    { label: "Yards", value: fmt(s.def_rush_yards) },
    { label: "TD", value: fmt(s.def_rush_touchdowns) },
    { label: "Yds/Carry", value: dec(s.def_rush_yards_per_carry) },
    { label: "Yds/Game", value: dec(s.def_rush_yards_per_game) },
    { label: "1st Downs", value: fmt(s.def_rush_first_downs) },
    { label: "Stuffs", value: fmt(s.def_rush_stuffs) },
    { label: "10+", value: fmt(s.def_rush_10_plus) },
    { label: "20+", value: fmt(s.def_rush_20_plus) },
  ];
}

function buildDefAdvRushing(s: TeamStats): Stat[] {
  return [
    { label: "EPA", value: epa(s.def_rush_epa_total) },
    { label: "EPA/Att", value: epa(s.def_rush_epa_per_attempt) },
    { label: "WPA", value: epa(s.def_rush_wpa_total) },
    { label: "WPA/Att", value: epa(s.def_rush_wpa_per_attempt) },
    { label: "Success", value: fmt(s.def_rush_success_total) },
    { label: "Success %", value: pct(s.def_rush_success_rate) },
    { label: "TD %", value: pct(s.def_rush_touchdown_rate) },
    { label: "Stuff %", value: pct(s.def_rush_stuff_rate) },
    { label: "10+ %", value: pct(s.def_rush_10_plus_rate) },
    { label: "20+ %", value: pct(s.def_rush_20_plus_rate) },
  ];
}

// ── DEFENSIVE TOTAL ──────────────────────────────────────────────────

function buildDefTotal(s: TeamStats): Stat[] {
  return [
    { label: "Plays", value: fmt(s.def_plays_total) },
    { label: "Drives", value: fmt(s.def_drives_total) },
    { label: "Yards", value: fmt(s.def_yards_total) },
    { label: "Points", value: fmt(s.def_points_total) },
    { label: "TD", value: fmt(s.def_touchdowns) },
    { label: "1st Downs", value: fmt(s.def_first_downs) },
    { label: "Fumbles", value: fmt(s.def_fumbles) },
    { label: "Fum Lost", value: fmt(s.def_fumbles_lost) },
    { label: "Turnovers", value: fmt(s.def_turnovers) },
    { label: "Explosive", value: fmt(s.def_explosive_plays) },
    { label: "Yds/Game", value: dec(s.def_yards_per_game) },
    { label: "Yds/Play", value: dec(s.def_yards_per_play) },
    { label: "Yds/Drive", value: dec(s.def_yards_per_drive) },
    { label: "Pts/Game", value: dec(s.def_points_per_game) },
    { label: "Pts/Play", value: dec(s.def_points_per_play, 2) },
    { label: "Pts/Drive", value: dec(s.def_points_per_drive) },
    { label: "EPA", value: epa(s.def_epa) },
    { label: "EPA/Game", value: epa(s.def_epa_per_game) },
    { label: "EPA/Play", value: epa(s.def_epa_per_play) },
    { label: "EPA/Drive", value: epa(s.def_epa_per_drive) },
    { label: "WPA", value: epa(s.def_wpa) },
    { label: "WPA/Game", value: epa(s.def_wpa_per_game) },
    { label: "WPA/Play", value: epa(s.def_wpa_per_play) },
    { label: "WPA/Drive", value: epa(s.def_wpa_per_drive) },
    { label: "Success", value: fmt(s.def_success_total) },
    { label: "Success %", value: pct(s.def_success_rate) },
    { label: "Explosive %", value: pct(s.def_explosive_play_rate) },
  ];
}

// ── DEFENSIVE SITUATIONAL ────────────────────────────────────────────

function buildDefSituational(s: TeamStats): Stat[] {
  return [
    { label: "3rd Down Att", value: fmt(s.def_third_down_attempts) },
    { label: "3rd Down Conv", value: fmt(s.def_third_down_conversions) },
    { label: "3rd Down %", value: pct(s.def_third_down_conversion_rate) },
    { label: "4th Down Att", value: fmt(s.def_fourth_down_attempts) },
    { label: "4th Down Conv", value: fmt(s.def_fourth_down_conversions) },
    { label: "4th Down %", value: pct(s.def_fourth_down_conversion_rate) },
    { label: "3-and-Outs", value: fmt(s.def_three_and_outs) },
    { label: "3-and-Out %", value: pct(s.def_three_and_out_rate) },
    { label: "Early Down Plays", value: fmt(s.def_early_down_total) },
    { label: "Early Down EPA", value: epa(s.def_early_down_epa) },
    { label: "Early Down EPA/Play", value: epa(s.def_early_down_epa_per_play) },
    { label: "Early Down Success", value: fmt(s.def_early_down_success) },
    { label: "Early Down Success %", value: pct(s.def_early_down_success_rate) },
    { label: "Early Down WPA", value: epa(s.def_early_down_wpa) },
    { label: "Early Down WPA/Play", value: epa(s.def_early_down_wpa_per_play) },
    { label: "Late Down Plays", value: fmt(s.def_late_down_total) },
    { label: "Late Down EPA", value: epa(s.def_late_down_epa) },
    { label: "Late Down EPA/Play", value: epa(s.def_late_down_epa_per_play) },
    { label: "Late Down Success", value: fmt(s.def_late_down_success) },
    { label: "Late Down Success %", value: pct(s.def_late_down_success_rate) },
    { label: "Late Down WPA", value: epa(s.def_late_down_wpa) },
    { label: "Late Down WPA/Play", value: epa(s.def_late_down_wpa_per_play) },
  ];
}

// ── COMPONENT ────────────────────────────────────────────────────────

export function TeamStatsDisplay({ stats }: TeamStatsDisplayProps) {
  const sections = [
    { key: "off-total", title: "Offensive Total", stats: buildOffTotal(stats) },
    { key: "off-passing", title: "Offensive Passing", stats: buildOffPassing(stats) },
    { key: "off-adv-passing", title: "Offensive Adv. Passing", stats: buildOffAdvPassing(stats) },
    { key: "off-rushing", title: "Offensive Rushing", stats: buildOffRushing(stats) },
    { key: "off-adv-rushing", title: "Offensive Adv. Rushing", stats: buildOffAdvRushing(stats) },
    { key: "off-situational", title: "Offensive Situational", stats: buildOffSituational(stats) },
    { key: "def-total", title: "Defensive Total", stats: buildDefTotal(stats) },
    { key: "def-passing", title: "Defensive Passing", stats: buildDefPassing(stats) },
    { key: "def-adv-passing", title: "Defensive Adv. Passing", stats: buildDefAdvPassing(stats) },
    { key: "def-rushing", title: "Defensive Rushing", stats: buildDefRushing(stats) },
    { key: "def-adv-rushing", title: "Defensive Adv. Rushing", stats: buildDefAdvRushing(stats) },
    { key: "def-situational", title: "Defensive Situational", stats: buildDefSituational(stats) },
  ];

  return (
    <div className="space-y-5">
      {sections.map((section) => (
        <StatSection
          key={section.key}
          title={section.title}
          stats={section.stats}
        />
      ))}
    </div>
  );
}
