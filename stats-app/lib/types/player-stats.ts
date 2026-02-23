export interface PlayerStats {
  // Base info
  player_id: string;
  first_name: string;
  last_name: string;
  first_season: number;
  last_season: number;

  // Record
  games_played: number;
  record: string;
  win_percentage: number;

  // Passing — raw
  pass_attempts: number;
  pass_completions: number;
  pass_yards: number;
  pass_touchdowns: number;
  pass_ints: number;
  pass_sacks: number;
  pass_sack_yards: number;
  pass_air_yards: number;
  pass_qb_hit: number;
  pass_qb_dropbacks: number;
  pass_first_downs: number;
  pass_yac_total: number;
  pass_epa: number;
  pass_cpoe_total: number;
  pass_success_total: number;
  pass_20_plus: number;
  pass_long: number;
  pass_yac_epa_total: number;

  // Passing — calculated
  pass_comp_percent: number;
  pass_yards_per_attempt: number;
  pass_yards_per_completion: number;
  pass_air_yards_per_attempt: number;
  pass_air_yards_per_completion: number;
  pass_yac_per_attempt: number;
  pass_yac_per_completion: number;
  pass_td_percent: number;
  pass_int_percent: number;
  pass_sack_percent: number;
  pass_qb_hit_percent: number;
  pass_cpoe: number;
  pass_success_rate: number;
  pass_20_plus_rate: number;
  pass_first_down_rate: number;
  pass_yards_per_game: number;
  pass_average_depth_of_target: number;
  pass_epa_per_attempt: number;
  pass_epa_per_completion: number;
  pass_epa_per_dropback: number;
  pass_yac_epa_per_attempt: number;
  pass_yac_epa_per_completion: number;
  pass_yac_epa_per_dropback: number;
  pass_rating: number;

  // Rushing — raw
  rush_attempts: number;
  rush_yards: number;
  rush_touchdowns: number;
  rush_long: number;
  rush_stuffs: number;
  rush_10_plus: number;
  rush_20_plus: number;
  rush_first_downs: number;
  rush_epa_total: number;
  rush_success_total: number;
  qb_scramble_attempts: number;
  qb_scramble_yards: number;
  qb_scramble_epa_total: number;
  qb_scramble_tds: number;
  qb_scramble_success_total: number;
  rush_fumbles: number;
  rush_fumbles_lost: number;

  // Rushing — calculated
  rush_yards_per_carry: number;
  rush_touchdown_rate: number;
  rush_stuff_rate: number;
  rush_10_plus_rate: number;
  rush_20_plus_rate: number;
  rush_yards_per_game: number;
  rush_epa_per_attempt: number;
  rush_success_rate: number;
  qb_scramble_yards_per_carry: number;
  qb_scramble_epa_per_carry: number;
  qb_scramble_yards_per_game: number;
  qb_scramble_success_rate: number;

  // Receiving — raw
  rec_targets: number;
  rec_receptions: number;
  rec_yards: number;
  rec_touchdowns: number;
  rec_air_yards_total: number;
  rec_yac_total: number;
  rec_first_downs: number;
  rec_epa_total: number;
  rec_success_total: number;
  rec_yac_epa_total: number;
  rec_20_plus: number;
  rec_long: number;
  rec_fumbles: number;
  rec_fumbles_lost: number;

  // Receiving — calculated
  rec_catch_rate: number;
  rec_yards_per_reception: number;
  rec_yards_per_target: number;
  rec_touchdown_rate: number;
  rec_air_yards_per_target: number;
  rec_air_yards_per_reception: number;
  rec_yac_per_reception: number;
  rec_air_yard_percent: number;
  rec_yac_percent: number;
  rec_first_down_rate: number;
  rec_epa_per_target: number;
  rec_epa_per_reception: number;
  rec_success_rate: number;
  rec_yac_epa_per_target: number;
  rec_yac_epa_per_reception: number;
  rec_20_plus_rate: number;
  rec_yards_per_game: number;

  // Totals — raw
  total_yards: number;
  total_plays: number;
  total_touchdowns: number;
  total_epa: number;
  total_first_downs: number;
  total_success_plays: number;
  total_fumbles: number;
  total_fumbles_lost: number;
  scrim_yards: number;
  scrim_touches: number;
  scrim_touchdowns: number;
  scrim_epa_total: number;
  scrim_first_downs: number;
  scrim_success_total: number;

  // Totals — calculated
  total_yards_per_play: number;
  total_yards_per_game: number;
  total_epa_per_play: number;
  total_success_rate: number;
  scrim_yards_per_touch: number;
  scrim_yards_per_game: number;
  scrim_epa_per_play: number;
  scrim_success_rate: number;

  // Fantasy
  ppr_points: number;
}
