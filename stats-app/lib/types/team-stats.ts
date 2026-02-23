export interface TeamStats {
  // Base info
  team_id: string;
  team_name: string;
  team_abbr: string;

  // Record
  games_played: number;
  record: string;
  win_percentage: number;

  // Offensive passing — raw
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
  off_pass_success_total: number;
  off_pass_20_plus: number;
  off_pass_dropbacks: number;

  // Offensive passing — calculated
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

  // Offensive rushing — raw
  off_rush_attempts: number;
  off_rush_yards: number;
  off_rush_touchdowns: number;
  off_rush_stuffs: number;
  off_rush_10_plus: number;
  off_rush_20_plus: number;
  off_rush_first_downs: number;
  off_rush_epa_total: number;
  off_rush_success_total: number;

  // Offensive rushing — calculated
  off_rush_yards_per_carry: number;
  off_rush_touchdown_rate: number;
  off_rush_stuff_rate: number;
  off_rush_10_plus_rate: number;
  off_rush_20_plus_rate: number;
  off_rush_yards_per_game: number;
  off_rush_epa_per_attempt: number;
  off_rush_success_rate: number;

  // Offensive total — raw
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
  off_success_total: number;
  off_explosive_plays: number;

  // Offensive total — calculated
  off_yards_per_game: number;
  off_yards_per_drive: number;
  off_yards_per_play: number;
  off_points_per_game: number;
  off_points_per_drive: number;
  off_points_per_play: number;
  off_epa_per_game: number;
  off_epa_per_drive: number;
  off_epa_per_play: number;
  off_success_rate: number;
  off_explosive_play_rate: number;

  // Offensive situational — raw
  off_third_down_attempts: number;
  off_third_down_conversions: number;
  off_fourth_down_attempts: number;
  off_fourth_down_conversions: number;
  off_three_and_outs: number;
  off_early_down_epa: number;
  off_early_down_success: number;
  off_late_down_epa: number;
  off_late_down_success: number;
  off_early_down_total: number;
  off_late_down_total: number;

  // Offensive situational — calculated
  off_third_down_conversion_rate: number;
  off_fourth_down_conversion_rate: number;
  off_three_and_out_rate: number;
  off_early_down_epa_per_play: number;
  off_early_down_success_rate: number;
  off_late_down_epa_per_play: number;
  off_late_down_success_rate: number;

  // Defensive passing — raw
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
  def_pass_success_total: number;
  def_pass_20_plus: number;
  def_pass_dropbacks: number;

  // Defensive passing — calculated
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

  // Defensive rushing — raw
  def_rush_attempts: number;
  def_rush_yards: number;
  def_rush_touchdowns: number;
  def_rush_stuffs: number;
  def_rush_10_plus: number;
  def_rush_20_plus: number;
  def_rush_first_downs: number;
  def_rush_epa_total: number;
  def_rush_success_total: number;

  // Defensive rushing — calculated
  def_rush_yards_per_carry: number;
  def_rush_touchdown_rate: number;
  def_rush_stuff_rate: number;
  def_rush_10_plus_rate: number;
  def_rush_20_plus_rate: number;
  def_rush_yards_per_game: number;
  def_rush_epa_per_attempt: number;
  def_rush_success_rate: number;

  // Defensive total — raw
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
  def_success_total: number;
  def_explosive_plays: number;

  // Defensive total — calculated
  def_yards_per_game: number;
  def_yards_per_drive: number;
  def_yards_per_play: number;
  def_points_per_game: number;
  def_points_per_drive: number;
  def_points_per_play: number;
  def_epa_per_game: number;
  def_epa_per_drive: number;
  def_epa_per_play: number;
  def_success_rate: number;
  def_explosive_play_rate: number;

  // Defensive situational — raw
  def_third_down_attempts: number;
  def_third_down_conversions: number;
  def_fourth_down_attempts: number;
  def_fourth_down_conversions: number;
  def_three_and_outs: number;
  def_early_down_epa: number;
  def_early_down_success: number;
  def_late_down_epa: number;
  def_late_down_success: number;
  def_early_down_total: number;
  def_late_down_total: number;

  // Defensive situational — calculated
  def_third_down_conversion_rate: number;
  def_fourth_down_conversion_rate: number;
  def_three_and_out_rate: number;
  def_early_down_epa_per_play: number;
  def_early_down_success_rate: number;
  def_late_down_epa_per_play: number;
  def_late_down_success_rate: number;
}
