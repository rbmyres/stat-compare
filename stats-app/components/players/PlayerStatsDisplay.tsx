import type { PlayerStats } from "@/lib/types/player-stats";
import { num, fmt, dec, pct, epa } from "@/lib/utils/format";
import { StatSection } from "./StatSection";

interface PlayerStatsDisplayProps {
  stats: PlayerStats;
  position: string;
}

type Stat = { label: string; value: string };

// ── PASSING ──────────────────────────────────────────────────────────

function buildPassing(s: PlayerStats): Stat[] {
  return [
    { label: "Att", value: fmt(s.pass_attempts) },
    { label: "Comp", value: fmt(s.pass_completions) },
    { label: "Yards", value: fmt(s.pass_yards) },
    { label: "TD", value: fmt(s.pass_touchdowns) },
    { label: "INT", value: fmt(s.pass_ints) },
    { label: "Rating", value: dec(s.pass_rating) },
    { label: "Comp %", value: pct(s.pass_comp_percent) },
    { label: "Yds/Att", value: dec(s.pass_yards_per_attempt) },
    { label: "Yds/Comp", value: dec(s.pass_yards_per_completion) },
    { label: "Yds/Game", value: dec(s.pass_yards_per_game) },
    { label: "Sacks", value: fmt(s.pass_sacks) },
    { label: "Sack Yds", value: fmt(s.pass_sack_yards) },
    { label: "QB Hits", value: fmt(s.pass_qb_hit) },
    { label: "Dropbacks", value: fmt(s.pass_qb_dropbacks) },
    { label: "1st Downs", value: fmt(s.pass_first_downs) },
    { label: "20+", value: fmt(s.pass_20_plus) },
    { label: "Long", value: fmt(s.pass_long) },
    { label: "Air Yds", value: fmt(s.pass_air_yards) },
    { label: "YAC", value: fmt(s.pass_yac_total) },
  ];
}

function buildAdvPassing(s: PlayerStats): Stat[] {
  return [
    { label: "EPA", value: epa(s.pass_epa) },
    { label: "EPA/Att", value: epa(s.pass_epa_per_attempt) },
    { label: "EPA/Comp", value: epa(s.pass_epa_per_completion) },
    { label: "EPA/Dropback", value: epa(s.pass_epa_per_dropback) },
    { label: "CPOE", value: epa(s.pass_cpoe) },
    { label: "CPOE Total", value: dec(s.pass_cpoe_total, 2) },
    { label: "Success", value: fmt(s.pass_success_total) },
    { label: "Success %", value: pct(s.pass_success_rate) },
    { label: "TD %", value: pct(s.pass_td_percent) },
    { label: "INT %", value: pct(s.pass_int_percent) },
    { label: "Sack %", value: pct(s.pass_sack_percent) },
    { label: "QB Hit %", value: pct(s.pass_qb_hit_percent) },
    { label: "1st Down %", value: pct(s.pass_first_down_rate) },
    { label: "20+ %", value: pct(s.pass_20_plus_rate) },
    { label: "aDOT", value: dec(s.pass_average_depth_of_target) },
    { label: "Air Yds/Att", value: dec(s.pass_air_yards_per_attempt) },
    { label: "Air Yds/Comp", value: dec(s.pass_air_yards_per_completion) },
    { label: "YAC/Att", value: dec(s.pass_yac_per_attempt) },
    { label: "YAC/Comp", value: dec(s.pass_yac_per_completion) },
  ];
}

// ── RUSHING ──────────────────────────────────────────────────────────

function buildRushing(s: PlayerStats): Stat[] {
  return [
    { label: "Carries", value: fmt(s.rush_attempts) },
    { label: "Yards", value: fmt(s.rush_yards) },
    { label: "TD", value: fmt(s.rush_touchdowns) },
    { label: "Yds/Carry", value: dec(s.rush_yards_per_carry) },
    { label: "Yds/Game", value: dec(s.rush_yards_per_game) },
    { label: "Long", value: fmt(s.rush_long) },
    { label: "1st Downs", value: fmt(s.rush_first_downs) },
    { label: "Stuffs", value: fmt(s.rush_stuffs) },
    { label: "10+", value: fmt(s.rush_10_plus) },
    { label: "20+", value: fmt(s.rush_20_plus) },
    { label: "Fumbles", value: fmt(s.rush_fumbles) },
    { label: "Fum Lost", value: fmt(s.rush_fumbles_lost) },
  ];
}

function buildAdvRushing(s: PlayerStats): Stat[] {
  return [
    { label: "EPA", value: epa(s.rush_epa_total) },
    { label: "EPA/Att", value: epa(s.rush_epa_per_attempt) },
    { label: "Success", value: fmt(s.rush_success_total) },
    { label: "Success %", value: pct(s.rush_success_rate) },
    { label: "TD %", value: pct(s.rush_touchdown_rate) },
    { label: "Stuff %", value: pct(s.rush_stuff_rate) },
    { label: "10+ %", value: pct(s.rush_10_plus_rate) },
    { label: "20+ %", value: pct(s.rush_20_plus_rate) },
    { label: "Scramble Att", value: fmt(s.qb_scramble_attempts) },
    { label: "Scramble Yds", value: fmt(s.qb_scramble_yards) },
    { label: "Scramble TD", value: fmt(s.qb_scramble_tds) },
    { label: "Scramble Yds/Carry", value: dec(s.qb_scramble_yards_per_carry) },
    { label: "Scramble Yds/Game", value: dec(s.qb_scramble_yards_per_game) },
    { label: "Scramble EPA", value: epa(s.qb_scramble_epa_total) },
    { label: "Scramble EPA/Carry", value: epa(s.qb_scramble_epa_per_carry) },
    { label: "Scramble Success", value: fmt(s.qb_scramble_success_total) },
    { label: "Scramble Success %", value: pct(s.qb_scramble_success_rate) },
  ];
}

// ── RECEIVING ────────────────────────────────────────────────────────

function buildReceiving(s: PlayerStats): Stat[] {
  return [
    { label: "Targets", value: fmt(s.rec_targets) },
    { label: "Rec", value: fmt(s.rec_receptions) },
    { label: "Yards", value: fmt(s.rec_yards) },
    { label: "TD", value: fmt(s.rec_touchdowns) },
    { label: "Catch %", value: pct(s.rec_catch_rate) },
    { label: "Yds/Rec", value: dec(s.rec_yards_per_reception) },
    { label: "Yds/Tgt", value: dec(s.rec_yards_per_target) },
    { label: "Yds/Game", value: dec(s.rec_yards_per_game) },
    { label: "Long", value: fmt(s.rec_long) },
    { label: "1st Downs", value: fmt(s.rec_first_downs) },
    { label: "20+", value: fmt(s.rec_20_plus) },
    { label: "Air Yds", value: fmt(s.rec_air_yards_total) },
    { label: "YAC", value: fmt(s.rec_yac_total) },
    { label: "Fumbles", value: fmt(s.rec_fumbles) },
    { label: "Fum Lost", value: fmt(s.rec_fumbles_lost) },
  ];
}

function buildAdvReceiving(s: PlayerStats): Stat[] {
  return [
    { label: "EPA", value: epa(s.rec_epa_total) },
    { label: "EPA/Tgt", value: epa(s.rec_epa_per_target) },
    { label: "EPA/Rec", value: epa(s.rec_epa_per_reception) },
    { label: "Success", value: fmt(s.rec_success_total) },
    { label: "Success %", value: pct(s.rec_success_rate) },
    { label: "TD %", value: pct(s.rec_touchdown_rate) },
    { label: "1st Down %", value: pct(s.rec_first_down_rate) },
    { label: "20+ %", value: pct(s.rec_20_plus_rate) },
    { label: "Air Yds/Tgt", value: dec(s.rec_air_yards_per_target) },
    { label: "Air Yds/Rec", value: dec(s.rec_air_yards_per_reception) },
    { label: "Air Yd %", value: pct(s.rec_air_yard_percent) },
    { label: "YAC/Rec", value: dec(s.rec_yac_per_reception) },
    { label: "YAC %", value: pct(s.rec_yac_percent) },
  ];
}

// ── TOTALS ───────────────────────────────────────────────────────────

function buildTotals(s: PlayerStats): Stat[] {
  return [
    { label: "Games", value: fmt(s.games_played) },
    { label: "Record", value: s.record },
    { label: "Win %", value: pct(num(s.win_percentage) * 100) },
    { label: "Total Plays", value: fmt(s.total_plays) },
    { label: "Total Yards", value: fmt(s.total_yards) },
    { label: "Total TD", value: fmt(s.total_touchdowns) },
    { label: "Total 1st Downs", value: fmt(s.total_first_downs) },
    { label: "Total Fumbles", value: fmt(s.total_fumbles) },
    { label: "Total Fum Lost", value: fmt(s.total_fumbles_lost) },
    { label: "Yds/Play", value: dec(s.total_yards_per_play) },
    { label: "Yds/Game", value: dec(s.total_yards_per_game) },
    { label: "Total EPA", value: epa(s.total_epa) },
    { label: "EPA/Play", value: epa(s.total_epa_per_play) },
    { label: "Success Plays", value: fmt(s.total_success_plays) },
    { label: "Success %", value: pct(s.total_success_rate) },
    { label: "Scrim Touches", value: fmt(s.scrim_touches) },
    { label: "Scrim Yards", value: fmt(s.scrim_yards) },
    { label: "Scrim TD", value: fmt(s.scrim_touchdowns) },
    { label: "Scrim 1st Downs", value: fmt(s.scrim_first_downs) },
    { label: "Scrim Yds/Touch", value: dec(s.scrim_yards_per_touch) },
    { label: "Scrim Yds/Game", value: dec(s.scrim_yards_per_game) },
    { label: "Scrim EPA", value: epa(s.scrim_epa_total) },
    { label: "Scrim EPA/Play", value: epa(s.scrim_epa_per_play) },
    { label: "Scrim Success", value: fmt(s.scrim_success_total) },
    { label: "Scrim Success %", value: pct(s.scrim_success_rate) },
    { label: "PPR Points", value: dec(s.ppr_points) },
  ];
}

// ── SECTIONS ─────────────────────────────────────────────────────────

type Section = {
  key: string;
  title: string;
  stats: Stat[];
  show: boolean;
};

export function PlayerStatsDisplay({ stats, position }: PlayerStatsDisplayProps) {
  const pos = position.toUpperCase();

  const passing: Section = {
    key: "passing",
    title: "Passing",
    stats: buildPassing(stats),
    show: num(stats.pass_attempts) > 0,
  };

  const advPassing: Section = {
    key: "adv-passing",
    title: "Advanced Passing",
    stats: buildAdvPassing(stats),
    show: num(stats.pass_attempts) > 0,
  };

  const rushing: Section = {
    key: "rushing",
    title: "Rushing",
    stats: buildRushing(stats),
    show: num(stats.rush_attempts) > 0,
  };

  const advRushing: Section = {
    key: "adv-rushing",
    title: "Advanced Rushing",
    stats: buildAdvRushing(stats),
    show: num(stats.rush_attempts) > 0,
  };

  const receiving: Section = {
    key: "receiving",
    title: "Receiving",
    stats: buildReceiving(stats),
    show: num(stats.rec_targets) > 0,
  };

  const advReceiving: Section = {
    key: "adv-receiving",
    title: "Advanced Receiving",
    stats: buildAdvReceiving(stats),
    show: num(stats.rec_targets) > 0,
  };

  const totals: Section = {
    key: "totals",
    title: "Totals & Scrimmage",
    stats: buildTotals(stats),
    show: true,
  };

  let sections: Section[];

  if (pos === "QB") {
    sections = [passing, advPassing, rushing, advRushing, receiving, advReceiving, totals];
  } else if (pos === "RB") {
    sections = [rushing, advRushing, receiving, advReceiving, passing, advPassing, totals];
  } else {
    // WR, TE, and any other position
    sections = [receiving, advReceiving, rushing, advRushing, passing, advPassing, totals];
  }

  const visible = sections.filter((s) => s.show);

  return (
    <div className="space-y-5">
      {visible.map((section) => (
        <StatSection
          key={section.key}
          title={section.title}
          stats={section.stats}
        />
      ))}
    </div>
  );
}
