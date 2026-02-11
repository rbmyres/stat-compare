// Date range filter parameters for all stat queries
export interface DateRangeParams {
  seasonStart?: number;
  seasonEnd?: number;
  weekStart?: number;
  weekEnd?: number;
  seasonType?: 'REG' | 'POST' | 'REG,POST';
}

// Base player info from players table
export interface Player {
  player_id: string;
  first_name: string;
  last_name: string;
  first_season: number;
  last_season: number;
}

// Base team info from teams table
export interface Team {
  team_id: string;
  abbr: string;
  display_name: string;
  nickname: string;
  primary_color: string;
}

// Player stats returned by player_stats() function (190+ columns)
export interface PlayerStats {
  // Base info
  player_id: string;
  first_name: string;
  last_name: string;
  first_season: number;
  last_season: number;

  // Win/Loss record
  games_played: number;
  record: string;
  win_percentage: number;

  // Raw passing stats
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
  pass_wpa: number;
  pass_cpoe_total: number;
  pass_success_total: number;
  pass_20_plus: number;
  pass_long: number;
  pass_yac_epa_total: number;
  pass_yac_wpa_total: number;

  // Calculated passing stats
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
  pass_wpa_per_attempt: number;
  pass_wpa_per_completion: number;
  pass_wpa_per_dropback: number;
  pass_yac_epa_per_attempt: number;
  pass_yac_epa_per_completion: number;
  pass_yac_epa_per_dropback: number;
  pass_yac_wpa_per_attempt: number;
  pass_yac_wpa_per_completion: number;
  pass_yac_wpa_per_dropback: number;
  pass_rating: number;

  // Raw rushing stats
  rush_attempts: number;
  rush_yards: number;
  rush_touchdowns: number;
  rush_long: number;
  rush_stuffs: number;
  rush_10_plus: number;
  rush_20_plus: number;
  rush_first_downs: number;
  rush_epa_total: number;
  rush_wpa_total: number;
  rush_success_total: number;
  qb_scramble_attempts: number;
  qb_scramble_yards: number;
  qb_scramble_epa_total: number;
  qb_scramble_tds: number;
  qb_scramble_wpa_total: number;
  qb_scramble_success_total: number;
  rush_fumbles: number;
  rush_fumbles_lost: number;

  // Calculated rushing stats
  rush_yards_per_carry: number;
  rush_touchdown_rate: number;
  rush_stuff_rate: number;
  rush_10_plus_rate: number;
  rush_20_plus_rate: number;
  rush_yards_per_game: number;
  rush_epa_per_attempt: number;
  rush_success_rate: number;
  rush_wpa_per_attempt: number;
  qb_scramble_yards_per_carry: number;
  qb_scramble_epa_per_carry: number;
  qb_scramble_wpa_per_carry: number;
  qb_scramble_yards_per_game: number;
  qb_scramble_success_rate: number;

  // Raw receiving stats
  rec_targets: number;
  rec_receptions: number;
  rec_yards: number;
  rec_touchdowns: number;
  rec_air_yards_total: number;
  rec_yac_total: number;
  rec_first_downs: number;
  rec_epa_total: number;
  rec_wpa_total: number;
  rec_success_total: number;
  rec_yac_epa_total: number;
  rec_yac_wpa_total: number;
  rec_20_plus: number;
  rec_long: number;
  rec_fumbles: number;
  rec_fumbles_lost: number;

  // Calculated receiving stats
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
  rec_wpa_per_target: number;
  rec_wpa_per_reception: number;
  rec_success_rate: number;
  rec_yac_epa_per_target: number;
  rec_yac_epa_per_reception: number;
  rec_yac_wpa_per_target: number;
  rec_yac_wpa_per_reception: number;
  rec_20_plus_rate: number;
  rec_yards_per_game: number;

  // Raw total stats
  total_yards: number;
  total_plays: number;
  total_touchdowns: number;
  total_epa: number;
  total_wpa: number;
  total_first_downs: number;
  total_success_plays: number;
  total_fumbles: number;
  total_fumbles_lost: number;
  scrim_yards: number;
  scrim_touches: number;
  scrim_touchdowns: number;
  scrim_epa_total: number;
  scrim_wpa_total: number;
  scrim_first_downs: number;
  scrim_success_total: number;

  // Calculated total stats
  total_yards_per_play: number;
  total_yards_per_game: number;
  total_epa_per_play: number;
  total_wpa_per_play: number;
  total_success_rate: number;
  scrim_yards_per_touch: number;
  scrim_yards_per_game: number;
  scrim_epa_per_play: number;
  scrim_wpa_per_play: number;
  scrim_success_rate: number;

  // Fantasy points
  ppr_points: number;
}

// Team stats returned by team_stats() function (230+ columns)
export interface TeamStats {
  // Base info
  team_id: string;
  team_name: string;
  team_abbr: string;

  // Win/Loss record
  games_played: number;
  record: string;
  win_percentage: number;

  // Raw offensive passing stats
  off_pass_attempts: number;
  off_pass_yards: number;
  off_pass_completions: number;
  off_pass_touchdowns: number;
  off_pass_ints: number;
  off_pass_sacks: number;
  off_pass_sack_yards: number;
  off_pass_air_yards: number;
  off_pass_qb_hit: number;
  off_pass_first_downs: number;
  off_pass_yac_total: number;
  off_pass_epa: number;
  off_pass_wpa: number;
  off_pass_success_total: number;
  off_pass_20_plus: number;
  off_pass_dropbacks: number;

  // Calculated offensive passing stats
  off_pass_comp_percent: number;
  off_pass_air_yards_per_attempt: number;
  off_pass_air_yards_per_completion: number;
  off_pass_yac_per_attempt: number;
  off_pass_yac_per_completion: number;
  off_pass_sack_percent: number;
  off_pass_qb_hit_percent: number;
  off_pass_success_rate: number;
  off_pass_20_plus_rate: number;
  off_pass_yards_per_game: number;
  off_pass_average_depth_of_target: number;
  off_pass_epa_per_attempt: number;
  off_pass_epa_per_completion: number;
  off_pass_epa_per_dropback: number;
  off_pass_wpa_per_attempt: number;
  off_pass_wpa_per_completion: number;
  off_pass_wpa_per_dropback: number;

  // Raw offensive rushing stats
  off_rush_attempts: number;
  off_rush_yards: number;
  off_rush_touchdowns: number;
  off_rush_stuffs: number;
  off_rush_10_plus: number;
  off_rush_20_plus: number;
  off_rush_first_downs: number;
  off_rush_epa_total: number;
  off_rush_success_total: number;
  off_rush_wpa_total: number;

  // Calculated offensive rushing stats
  off_rush_yards_per_carry: number;
  off_rush_touchdown_rate: number;
  off_rush_stuff_rate: number;
  off_rush_10_plus_rate: number;
  off_rush_20_plus_rate: number;
  off_rush_yards_per_game: number;
  off_rush_epa_per_attempt: number;
  off_rush_success_rate: number;
  off_rush_wpa_per_attempt: number;

  // Raw offensive total stats
  off_plays_total: number;
  off_drives_total: number;
  off_yards_total: number;
  off_points_total: number;
  off_first_downs: number;
  off_touchdowns: number;
  off_fumbles: number;
  off_fumbles_lost: number;
  off_turnovers: number;
  off_epa: number;
  off_wpa: number;
  off_success_total: number;
  off_explosive_plays: number;

  // Calculated offensive total stats
  off_yards_per_game: number;
  off_yards_per_drive: number;
  off_yards_per_play: number;
  off_points_per_game: number;
  off_points_per_drive: number;
  off_points_per_play: number;
  off_epa_per_game: number;
  off_epa_per_drive: number;
  off_epa_per_play: number;
  off_wpa_per_game: number;
  off_wpa_per_drive: number;
  off_wpa_per_play: number;
  off_success_rate: number;
  off_explosive_play_rate: number;

  // Raw offensive situational stats
  off_third_down_attempts: number;
  off_third_down_conversions: number;
  off_fourth_down_attempts: number;
  off_fourth_down_conversions: number;
  off_three_and_outs: number;
  off_early_down_epa: number;
  off_early_down_success: number;
  off_early_down_wpa: number;
  off_late_down_epa: number;
  off_late_down_success: number;
  off_late_down_wpa: number;
  off_early_down_total: number;
  off_late_down_total: number;

  // Calculated offensive situational stats
  off_third_down_conversion_rate: number;
  off_fourth_down_conversion_rate: number;
  off_three_and_out_rate: number;
  off_early_down_epa_per_play: number;
  off_early_down_success_rate: number;
  off_early_down_wpa_per_play: number;
  off_late_down_epa_per_play: number;
  off_late_down_success_rate: number;
  off_late_down_wpa_per_play: number;

  // Raw defensive passing stats
  def_pass_attempts: number;
  def_pass_yards: number;
  def_pass_completions: number;
  def_pass_touchdowns: number;
  def_pass_ints: number;
  def_pass_sacks: number;
  def_pass_sack_yards: number;
  def_pass_air_yards: number;
  def_pass_qb_hit: number;
  def_pass_first_downs: number;
  def_pass_yac_total: number;
  def_pass_epa: number;
  def_pass_wpa: number;
  def_pass_success_total: number;
  def_pass_20_plus: number;
  def_pass_dropbacks: number;

  // Calculated defensive passing stats
  def_pass_comp_percent: number;
  def_pass_air_yards_per_attempt: number;
  def_pass_air_yards_per_completion: number;
  def_pass_yac_per_attempt: number;
  def_pass_yac_per_completion: number;
  def_pass_sack_percent: number;
  def_pass_qb_hit_percent: number;
  def_pass_success_rate: number;
  def_pass_20_plus_rate: number;
  def_pass_yards_per_game: number;
  def_pass_average_depth_of_target: number;
  def_pass_epa_per_attempt: number;
  def_pass_epa_per_completion: number;
  def_pass_epa_per_dropback: number;
  def_pass_wpa_per_attempt: number;
  def_pass_wpa_per_completion: number;
  def_pass_wpa_per_dropback: number;

  // Raw defensive rushing stats
  def_rush_attempts: number;
  def_rush_yards: number;
  def_rush_touchdowns: number;
  def_rush_stuffs: number;
  def_rush_10_plus: number;
  def_rush_20_plus: number;
  def_rush_first_downs: number;
  def_rush_epa_total: number;
  def_rush_success_total: number;
  def_rush_wpa_total: number;

  // Calculated defensive rushing stats
  def_rush_yards_per_carry: number;
  def_rush_touchdown_rate: number;
  def_rush_stuff_rate: number;
  def_rush_10_plus_rate: number;
  def_rush_20_plus_rate: number;
  def_rush_yards_per_game: number;
  def_rush_epa_per_attempt: number;
  def_rush_success_rate: number;
  def_rush_wpa_per_attempt: number;

  // Raw defensive total stats
  def_plays_total: number;
  def_drives_total: number;
  def_yards_total: number;
  def_points_total: number;
  def_first_downs: number;
  def_touchdowns: number;
  def_fumbles: number;
  def_fumbles_lost: number;
  def_turnovers: number;
  def_epa: number;
  def_wpa: number;
  def_success_total: number;
  def_explosive_plays: number;

  // Calculated defensive total stats
  def_yards_per_game: number;
  def_yards_per_drive: number;
  def_yards_per_play: number;
  def_points_per_game: number;
  def_points_per_drive: number;
  def_points_per_play: number;
  def_epa_per_game: number;
  def_epa_per_drive: number;
  def_epa_per_play: number;
  def_wpa_per_game: number;
  def_wpa_per_drive: number;
  def_wpa_per_play: number;
  def_success_rate: number;
  def_explosive_play_rate: number;

  // Raw defensive situational stats
  def_third_down_attempts: number;
  def_third_down_conversions: number;
  def_fourth_down_attempts: number;
  def_fourth_down_conversions: number;
  def_three_and_outs: number;
  def_early_down_epa: number;
  def_early_down_success: number;
  def_early_down_wpa: number;
  def_late_down_epa: number;
  def_late_down_success: number;
  def_late_down_wpa: number;
  def_early_down_total: number;
  def_late_down_total: number;

  // Calculated defensive situational stats
  def_third_down_conversion_rate: number;
  def_fourth_down_conversion_rate: number;
  def_three_and_out_rate: number;
  def_early_down_epa_per_play: number;
  def_early_down_success_rate: number;
  def_early_down_wpa_per_play: number;
  def_late_down_epa_per_play: number;
  def_late_down_success_rate: number;
  def_late_down_wpa_per_play: number;
}

// Search result item
export interface SearchResult {
  type: 'player' | 'team';
  id: string;
  name: string;
  subtitle?: string; // Position for players, city for teams
}
