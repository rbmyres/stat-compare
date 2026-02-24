import type { TeamStats } from "@/lib/types/team-stats";
import { num, fmt, dec, pct, epa } from "@/lib/utils/format";
import { StatSection } from "@/components/players/StatSection";

interface TeamStatsDisplayProps {
  stats: TeamStats;
}

type Stat = { label: string; value: string; key: string };

// ── OFFENSIVE PASSING ────────────────────────────────────────────────

function buildOffPassing(s: TeamStats): Stat[] {
  return [
    { label: "Att", value: fmt(s.off_pass_attempts), key: "off_pass_attempts" },
    { label: "Comp", value: fmt(s.off_pass_completions), key: "off_pass_completions" },
    { label: "Yards", value: fmt(s.off_pass_yards), key: "off_pass_yards" },
    { label: "TD", value: fmt(s.off_pass_touchdowns), key: "off_pass_touchdowns" },
    { label: "INT", value: fmt(s.off_pass_ints), key: "off_pass_ints" },
    { label: "Comp %", value: pct(s.off_pass_comp_percent), key: "off_pass_comp_percent" },
    { label: "Yds/Game", value: dec(s.off_pass_yards_per_game), key: "off_pass_yards_per_game" },
    { label: "Sacks", value: fmt(s.off_pass_sacks), key: "off_pass_sacks" },
    { label: "Sack Yds", value: fmt(s.off_pass_sack_yards), key: "off_pass_sack_yards" },
    { label: "QB Hits", value: fmt(s.off_pass_qb_hit), key: "off_pass_qb_hit" },
    { label: "Dropbacks", value: fmt(s.off_pass_dropbacks), key: "off_pass_dropbacks" },
    { label: "1st Downs", value: fmt(s.off_pass_first_downs), key: "off_pass_first_downs" },
    { label: "20+", value: fmt(s.off_pass_20_plus), key: "off_pass_20_plus" },
    { label: "Air Yds", value: fmt(s.off_pass_air_yards), key: "off_pass_air_yards" },
    { label: "YAC", value: fmt(s.off_pass_yac_total), key: "off_pass_yac_total" },
  ];
}

function buildOffAdvPassing(s: TeamStats): Stat[] {
  return [
    { label: "EPA", value: epa(s.off_pass_epa), key: "off_pass_epa" },
    { label: "EPA/Att", value: epa(s.off_pass_epa_per_attempt), key: "off_pass_epa_per_attempt" },
    { label: "EPA/Comp", value: epa(s.off_pass_epa_per_completion), key: "off_pass_epa_per_completion" },
    { label: "EPA/Drop", value: epa(s.off_pass_epa_per_dropback), key: "off_pass_epa_per_dropback" },
    { label: "Success", value: fmt(s.off_pass_success_total), key: "off_pass_success_total" },
    { label: "Success %", value: pct(s.off_pass_success_rate), key: "off_pass_success_rate" },
    { label: "Sack %", value: pct(s.off_pass_sack_percent), key: "off_pass_sack_percent" },
    { label: "QB Hit %", value: pct(s.off_pass_qb_hit_percent), key: "off_pass_qb_hit_percent" },
    { label: "20+ %", value: pct(s.off_pass_20_plus_rate), key: "off_pass_20_plus_rate" },
    { label: "aDOT", value: dec(s.off_pass_average_depth_of_target), key: "off_pass_average_depth_of_target" },
    { label: "Air Yds/Att", value: dec(s.off_pass_air_yards_per_attempt), key: "off_pass_air_yards_per_attempt" },
    { label: "Air Yds/Comp", value: dec(s.off_pass_air_yards_per_completion), key: "off_pass_air_yards_per_completion" },
    { label: "YAC/Att", value: dec(s.off_pass_yac_per_attempt), key: "off_pass_yac_per_attempt" },
    { label: "YAC/Comp", value: dec(s.off_pass_yac_per_completion), key: "off_pass_yac_per_completion" },
  ];
}

// ── OFFENSIVE RUSHING ────────────────────────────────────────────────

function buildOffRushing(s: TeamStats): Stat[] {
  return [
    { label: "Att", value: fmt(s.off_rush_attempts), key: "off_rush_attempts" },
    { label: "Yards", value: fmt(s.off_rush_yards), key: "off_rush_yards" },
    { label: "TD", value: fmt(s.off_rush_touchdowns), key: "off_rush_touchdowns" },
    { label: "Yds/Carry", value: dec(s.off_rush_yards_per_carry), key: "off_rush_yards_per_carry" },
    { label: "Yds/Game", value: dec(s.off_rush_yards_per_game), key: "off_rush_yards_per_game" },
    { label: "1st Downs", value: fmt(s.off_rush_first_downs), key: "off_rush_first_downs" },
    { label: "Stuffs", value: fmt(s.off_rush_stuffs), key: "off_rush_stuffs" },
    { label: "10+", value: fmt(s.off_rush_10_plus), key: "off_rush_10_plus" },
    { label: "20+", value: fmt(s.off_rush_20_plus), key: "off_rush_20_plus" },
  ];
}

function buildOffAdvRushing(s: TeamStats): Stat[] {
  return [
    { label: "EPA", value: epa(s.off_rush_epa_total), key: "off_rush_epa_total" },
    { label: "EPA/Att", value: epa(s.off_rush_epa_per_attempt), key: "off_rush_epa_per_attempt" },
    { label: "Success", value: fmt(s.off_rush_success_total), key: "off_rush_success_total" },
    { label: "Success %", value: pct(s.off_rush_success_rate), key: "off_rush_success_rate" },
    { label: "TD %", value: pct(s.off_rush_touchdown_rate), key: "off_rush_touchdown_rate" },
    { label: "Stuff %", value: pct(s.off_rush_stuff_rate), key: "off_rush_stuff_rate" },
    { label: "10+ %", value: pct(s.off_rush_10_plus_rate), key: "off_rush_10_plus_rate" },
    { label: "20+ %", value: pct(s.off_rush_20_plus_rate), key: "off_rush_20_plus_rate" },
  ];
}

// ── OFFENSIVE OVERVIEW ───────────────────────────────────────────────

function buildOffOverview(s: TeamStats): Stat[] {
  return [
    { label: "Games", value: fmt(s.games_played), key: "games_played" },
    { label: "Record", value: s.record, key: "record" },
    { label: "Win %", value: pct(num(s.win_percentage) * 100), key: "win_percentage" },
    { label: "Plays", value: fmt(s.off_plays_total), key: "off_plays_total" },
    { label: "Drives", value: fmt(s.off_drives_total), key: "off_drives_total" },
    { label: "Yards", value: fmt(s.off_yards_total), key: "off_yards_total" },
    { label: "Points", value: fmt(s.off_points_total), key: "off_points_total" },
    { label: "TD", value: fmt(s.off_touchdowns), key: "off_touchdowns" },
    { label: "1st Downs", value: fmt(s.off_first_downs), key: "off_first_downs" },
    { label: "Fumbles", value: fmt(s.off_fumbles), key: "off_fumbles" },
    { label: "Fum Lost", value: fmt(s.off_fumbles_lost), key: "off_fumbles_lost" },
    { label: "Turnovers", value: fmt(s.off_turnovers), key: "off_turnovers" },
    { label: "Explosive", value: fmt(s.off_explosive_plays), key: "off_explosive_plays" },
  ];
}

// ── OFFENSIVE EFFICIENCY ────────────────────────────────────────────

function buildOffEfficiency(s: TeamStats): Stat[] {
  return [
    { label: "Yds/Game", value: dec(s.off_yards_per_game), key: "off_yards_per_game" },
    { label: "Yds/Play", value: dec(s.off_yards_per_play), key: "off_yards_per_play" },
    { label: "Yds/Drive", value: dec(s.off_yards_per_drive), key: "off_yards_per_drive" },
    { label: "Pts/Game", value: dec(s.off_points_per_game), key: "off_points_per_game" },
    { label: "Pts/Play", value: dec(s.off_points_per_play, 2), key: "off_points_per_play" },
    { label: "Pts/Drive", value: dec(s.off_points_per_drive), key: "off_points_per_drive" },
    { label: "EPA", value: epa(s.off_epa), key: "off_epa" },
    { label: "EPA/Game", value: epa(s.off_epa_per_game), key: "off_epa_per_game" },
    { label: "EPA/Play", value: epa(s.off_epa_per_play), key: "off_epa_per_play" },
    { label: "EPA/Drive", value: epa(s.off_epa_per_drive), key: "off_epa_per_drive" },
    { label: "Success", value: fmt(s.off_success_total), key: "off_success_total" },
    { label: "Success %", value: pct(s.off_success_rate), key: "off_success_rate" },
    { label: "Explosive %", value: pct(s.off_explosive_play_rate), key: "off_explosive_play_rate" },
  ];
}

// ── OFFENSIVE SITUATIONAL ────────────────────────────────────────────

function buildOffSituational(s: TeamStats): Stat[] {
  return [
    { label: "3rd Down Att", value: fmt(s.off_third_down_attempts), key: "off_third_down_attempts" },
    { label: "3rd Down Conv", value: fmt(s.off_third_down_conversions), key: "off_third_down_conversions" },
    { label: "3rd Down %", value: pct(s.off_third_down_conversion_rate), key: "off_third_down_conversion_rate" },
    { label: "4th Down Att", value: fmt(s.off_fourth_down_attempts), key: "off_fourth_down_attempts" },
    { label: "4th Down Conv", value: fmt(s.off_fourth_down_conversions), key: "off_fourth_down_conversions" },
    { label: "4th Down %", value: pct(s.off_fourth_down_conversion_rate), key: "off_fourth_down_conversion_rate" },
    { label: "3-and-Outs", value: fmt(s.off_three_and_outs), key: "off_three_and_outs" },
    { label: "3-and-Out %", value: pct(s.off_three_and_out_rate), key: "off_three_and_out_rate" },
    { label: "Early Down Plays", value: fmt(s.off_early_down_total), key: "off_early_down_total" },
    { label: "Early Down EPA", value: epa(s.off_early_down_epa), key: "off_early_down_epa" },
    { label: "Early Down EPA/Play", value: epa(s.off_early_down_epa_per_play), key: "off_early_down_epa_per_play" },
    { label: "Early Down Success", value: fmt(s.off_early_down_success), key: "off_early_down_success" },
    { label: "Early Down Success %", value: pct(s.off_early_down_success_rate), key: "off_early_down_success_rate" },
    { label: "Late Down Plays", value: fmt(s.off_late_down_total), key: "off_late_down_total" },
    { label: "Late Down EPA", value: epa(s.off_late_down_epa), key: "off_late_down_epa" },
    { label: "Late Down EPA/Play", value: epa(s.off_late_down_epa_per_play), key: "off_late_down_epa_per_play" },
    { label: "Late Down Success", value: fmt(s.off_late_down_success), key: "off_late_down_success" },
    { label: "Late Down Success %", value: pct(s.off_late_down_success_rate), key: "off_late_down_success_rate" },
  ];
}

// ── DEFENSIVE PASSING ────────────────────────────────────────────────

function buildDefPassing(s: TeamStats): Stat[] {
  return [
    { label: "Att", value: fmt(s.def_pass_attempts), key: "def_pass_attempts" },
    { label: "Comp", value: fmt(s.def_pass_completions), key: "def_pass_completions" },
    { label: "Yards", value: fmt(s.def_pass_yards), key: "def_pass_yards" },
    { label: "TD", value: fmt(s.def_pass_touchdowns), key: "def_pass_touchdowns" },
    { label: "INT", value: fmt(s.def_pass_ints), key: "def_pass_ints" },
    { label: "Comp %", value: pct(s.def_pass_comp_percent), key: "def_pass_comp_percent" },
    { label: "Yds/Game", value: dec(s.def_pass_yards_per_game), key: "def_pass_yards_per_game" },
    { label: "Sacks", value: fmt(s.def_pass_sacks), key: "def_pass_sacks" },
    { label: "Sack Yds", value: fmt(s.def_pass_sack_yards), key: "def_pass_sack_yards" },
    { label: "QB Hits", value: fmt(s.def_pass_qb_hit), key: "def_pass_qb_hit" },
    { label: "Dropbacks", value: fmt(s.def_pass_dropbacks), key: "def_pass_dropbacks" },
    { label: "1st Downs", value: fmt(s.def_pass_first_downs), key: "def_pass_first_downs" },
    { label: "20+", value: fmt(s.def_pass_20_plus), key: "def_pass_20_plus" },
    { label: "Air Yds", value: fmt(s.def_pass_air_yards), key: "def_pass_air_yards" },
    { label: "YAC", value: fmt(s.def_pass_yac_total), key: "def_pass_yac_total" },
  ];
}

function buildDefAdvPassing(s: TeamStats): Stat[] {
  return [
    { label: "EPA", value: epa(s.def_pass_epa), key: "def_pass_epa" },
    { label: "EPA/Att", value: epa(s.def_pass_epa_per_attempt), key: "def_pass_epa_per_attempt" },
    { label: "EPA/Comp", value: epa(s.def_pass_epa_per_completion), key: "def_pass_epa_per_completion" },
    { label: "EPA/Drop", value: epa(s.def_pass_epa_per_dropback), key: "def_pass_epa_per_dropback" },
    { label: "Success", value: fmt(s.def_pass_success_total), key: "def_pass_success_total" },
    { label: "Success %", value: pct(s.def_pass_success_rate), key: "def_pass_success_rate" },
    { label: "Sack %", value: pct(s.def_pass_sack_percent), key: "def_pass_sack_percent" },
    { label: "QB Hit %", value: pct(s.def_pass_qb_hit_percent), key: "def_pass_qb_hit_percent" },
    { label: "20+ %", value: pct(s.def_pass_20_plus_rate), key: "def_pass_20_plus_rate" },
    { label: "aDOT", value: dec(s.def_pass_average_depth_of_target), key: "def_pass_average_depth_of_target" },
    { label: "Air Yds/Att", value: dec(s.def_pass_air_yards_per_attempt), key: "def_pass_air_yards_per_attempt" },
    { label: "Air Yds/Comp", value: dec(s.def_pass_air_yards_per_completion), key: "def_pass_air_yards_per_completion" },
    { label: "YAC/Att", value: dec(s.def_pass_yac_per_attempt), key: "def_pass_yac_per_attempt" },
    { label: "YAC/Comp", value: dec(s.def_pass_yac_per_completion), key: "def_pass_yac_per_completion" },
  ];
}

// ── DEFENSIVE RUSHING ────────────────────────────────────────────────

function buildDefRushing(s: TeamStats): Stat[] {
  return [
    { label: "Att", value: fmt(s.def_rush_attempts), key: "def_rush_attempts" },
    { label: "Yards", value: fmt(s.def_rush_yards), key: "def_rush_yards" },
    { label: "TD", value: fmt(s.def_rush_touchdowns), key: "def_rush_touchdowns" },
    { label: "Yds/Carry", value: dec(s.def_rush_yards_per_carry), key: "def_rush_yards_per_carry" },
    { label: "Yds/Game", value: dec(s.def_rush_yards_per_game), key: "def_rush_yards_per_game" },
    { label: "1st Downs", value: fmt(s.def_rush_first_downs), key: "def_rush_first_downs" },
    { label: "Stuffs", value: fmt(s.def_rush_stuffs), key: "def_rush_stuffs" },
    { label: "10+", value: fmt(s.def_rush_10_plus), key: "def_rush_10_plus" },
    { label: "20+", value: fmt(s.def_rush_20_plus), key: "def_rush_20_plus" },
  ];
}

function buildDefAdvRushing(s: TeamStats): Stat[] {
  return [
    { label: "EPA", value: epa(s.def_rush_epa_total), key: "def_rush_epa_total" },
    { label: "EPA/Att", value: epa(s.def_rush_epa_per_attempt), key: "def_rush_epa_per_attempt" },
    { label: "Success", value: fmt(s.def_rush_success_total), key: "def_rush_success_total" },
    { label: "Success %", value: pct(s.def_rush_success_rate), key: "def_rush_success_rate" },
    { label: "TD %", value: pct(s.def_rush_touchdown_rate), key: "def_rush_touchdown_rate" },
    { label: "Stuff %", value: pct(s.def_rush_stuff_rate), key: "def_rush_stuff_rate" },
    { label: "10+ %", value: pct(s.def_rush_10_plus_rate), key: "def_rush_10_plus_rate" },
    { label: "20+ %", value: pct(s.def_rush_20_plus_rate), key: "def_rush_20_plus_rate" },
  ];
}

// ── DEFENSIVE OVERVIEW ───────────────────────────────────────────────

function buildDefOverview(s: TeamStats): Stat[] {
  return [
    { label: "Plays", value: fmt(s.def_plays_total), key: "def_plays_total" },
    { label: "Drives", value: fmt(s.def_drives_total), key: "def_drives_total" },
    { label: "Yards", value: fmt(s.def_yards_total), key: "def_yards_total" },
    { label: "Points", value: fmt(s.def_points_total), key: "def_points_total" },
    { label: "TD", value: fmt(s.def_touchdowns), key: "def_touchdowns" },
    { label: "1st Downs", value: fmt(s.def_first_downs), key: "def_first_downs" },
    { label: "Fumbles", value: fmt(s.def_fumbles), key: "def_fumbles" },
    { label: "Fum Lost", value: fmt(s.def_fumbles_lost), key: "def_fumbles_lost" },
    { label: "Turnovers", value: fmt(s.def_turnovers), key: "def_turnovers" },
    { label: "Explosive", value: fmt(s.def_explosive_plays), key: "def_explosive_plays" },
  ];
}

// ── DEFENSIVE EFFICIENCY ────────────────────────────────────────────

function buildDefEfficiency(s: TeamStats): Stat[] {
  return [
    { label: "Yds/Game", value: dec(s.def_yards_per_game), key: "def_yards_per_game" },
    { label: "Yds/Play", value: dec(s.def_yards_per_play), key: "def_yards_per_play" },
    { label: "Yds/Drive", value: dec(s.def_yards_per_drive), key: "def_yards_per_drive" },
    { label: "Pts/Game", value: dec(s.def_points_per_game), key: "def_points_per_game" },
    { label: "Pts/Play", value: dec(s.def_points_per_play, 2), key: "def_points_per_play" },
    { label: "Pts/Drive", value: dec(s.def_points_per_drive), key: "def_points_per_drive" },
    { label: "EPA", value: epa(s.def_epa), key: "def_epa" },
    { label: "EPA/Game", value: epa(s.def_epa_per_game), key: "def_epa_per_game" },
    { label: "EPA/Play", value: epa(s.def_epa_per_play), key: "def_epa_per_play" },
    { label: "EPA/Drive", value: epa(s.def_epa_per_drive), key: "def_epa_per_drive" },
    { label: "Success", value: fmt(s.def_success_total), key: "def_success_total" },
    { label: "Success %", value: pct(s.def_success_rate), key: "def_success_rate" },
    { label: "Explosive %", value: pct(s.def_explosive_play_rate), key: "def_explosive_play_rate" },
  ];
}

// ── DEFENSIVE SITUATIONAL ────────────────────────────────────────────

function buildDefSituational(s: TeamStats): Stat[] {
  return [
    { label: "3rd Down Att", value: fmt(s.def_third_down_attempts), key: "def_third_down_attempts" },
    { label: "3rd Down Conv", value: fmt(s.def_third_down_conversions), key: "def_third_down_conversions" },
    { label: "3rd Down %", value: pct(s.def_third_down_conversion_rate), key: "def_third_down_conversion_rate" },
    { label: "4th Down Att", value: fmt(s.def_fourth_down_attempts), key: "def_fourth_down_attempts" },
    { label: "4th Down Conv", value: fmt(s.def_fourth_down_conversions), key: "def_fourth_down_conversions" },
    { label: "4th Down %", value: pct(s.def_fourth_down_conversion_rate), key: "def_fourth_down_conversion_rate" },
    { label: "3-and-Outs", value: fmt(s.def_three_and_outs), key: "def_three_and_outs" },
    { label: "3-and-Out %", value: pct(s.def_three_and_out_rate), key: "def_three_and_out_rate" },
    { label: "Early Down Plays", value: fmt(s.def_early_down_total), key: "def_early_down_total" },
    { label: "Early Down EPA", value: epa(s.def_early_down_epa), key: "def_early_down_epa" },
    { label: "Early Down EPA/Play", value: epa(s.def_early_down_epa_per_play), key: "def_early_down_epa_per_play" },
    { label: "Early Down Success", value: fmt(s.def_early_down_success), key: "def_early_down_success" },
    { label: "Early Down Success %", value: pct(s.def_early_down_success_rate), key: "def_early_down_success_rate" },
    { label: "Late Down Plays", value: fmt(s.def_late_down_total), key: "def_late_down_total" },
    { label: "Late Down EPA", value: epa(s.def_late_down_epa), key: "def_late_down_epa" },
    { label: "Late Down EPA/Play", value: epa(s.def_late_down_epa_per_play), key: "def_late_down_epa_per_play" },
    { label: "Late Down Success", value: fmt(s.def_late_down_success), key: "def_late_down_success" },
    { label: "Late Down Success %", value: pct(s.def_late_down_success_rate), key: "def_late_down_success_rate" },
  ];
}

// ── COMPONENT ────────────────────────────────────────────────────────

export function TeamStatsDisplay({ stats }: TeamStatsDisplayProps) {
  const sections = [
    { key: "off-overview", title: "Offensive Overview", stats: buildOffOverview(stats) },
    { key: "off-efficiency", title: "Offensive Efficiency", stats: buildOffEfficiency(stats) },
    { key: "off-passing", title: "Offensive Passing", stats: buildOffPassing(stats) },
    { key: "off-adv-passing", title: "Offensive Adv. Passing", stats: buildOffAdvPassing(stats) },
    { key: "off-rushing", title: "Offensive Rushing", stats: buildOffRushing(stats) },
    { key: "off-adv-rushing", title: "Offensive Adv. Rushing", stats: buildOffAdvRushing(stats) },
    { key: "off-situational", title: "Offensive Situational", stats: buildOffSituational(stats) },
    { key: "def-overview", title: "Defensive Overview", stats: buildDefOverview(stats) },
    { key: "def-efficiency", title: "Defensive Efficiency", stats: buildDefEfficiency(stats) },
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
