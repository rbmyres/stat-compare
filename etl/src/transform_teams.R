# Team Statistics Transformation

library(dplyr)
library(logger)
library(tidyr)
library(purrr)

transform_team_stats <- function(pbp_data, season) {
  cat(paste("Transforming team stats for season", season, "...\n"))

  pbp_reg <- pbp_data %>%
    filter(
      (two_point_attempt != 1 | is.na(two_point_attempt)),
      play == 1
    )

  cat("Calculating offensive passing stats...\n")
  team_dropbacks <- pbp_reg %>%
    filter(
      !is.na(posteam),
      (
        (qb_dropback == 1 | qb_spike == 1) |
        (qb_scramble == 1)
      )
    ) %>%
    distinct(game_id, play_id, .keep_all = TRUE) %>%
    mutate(
      is_20_plus = ifelse(!is.na(passing_yards) & passing_yards >= 20, TRUE, FALSE),
      is_success = ifelse(!is.na(success), success == 1, FALSE),
      yac = ifelse(!is.na(yards_after_catch), yards_after_catch, 0)
    )

  off_pass_stats <- team_dropbacks %>%
    group_by(team_id = posteam, week) %>%
    summarise(
      off_pass_dropbacks = n(),
      off_pass_yards = sum(passing_yards, na.rm = TRUE),
      off_pass_completions = sum(complete_pass, na.rm = TRUE),
      off_pass_touchdowns = sum(pass_touchdown, na.rm = TRUE),
      off_pass_ints = sum(interception, na.rm = TRUE),
      off_pass_sacks = sum(sack, na.rm = TRUE),
      off_pass_sack_yards = abs(sum(ifelse(sack == 1, yards_gained, 0), na.rm = TRUE)),
      off_pass_air_yards = sum(air_yards, na.rm = TRUE),
      off_pass_qb_hit = sum(qb_hit == 1 & sack != 1, na.rm = TRUE),
      off_pass_first_downs = sum(first_down_pass, na.rm = TRUE),
      off_pass_yac_total = sum(yac, na.rm = TRUE),
      off_pass_epa = round(sum(ifelse(qb_scramble != 1, epa, 0), na.rm = TRUE), 4),
      off_pass_success_total = sum(is_success, na.rm = TRUE),
      off_pass_20_plus = sum(is_20_plus, na.rm = TRUE),
      .groups = "drop"
    ) %>%
    mutate(week = as.integer(week))

  # Pass attempts from original data to match nflverse reference
  team_pass_attempts_data <- pbp_data %>%
    filter(
      season_type == "REG",
      (two_point_attempt != 1 | is.na(two_point_attempt)),
      !is.na(posteam),
      pass_attempt == 1,
      (is.na(sack) | sack == 0)
    ) %>%
    group_by(team_id = posteam, week) %>%
    summarise(off_pass_attempts = n(), .groups = "drop") %>%
    mutate(week = as.integer(week))

  off_pass_stats <- off_pass_stats %>%
    left_join(team_pass_attempts_data, by = c("team_id", "week")) %>%
    mutate(off_pass_attempts = replace_na(off_pass_attempts, 0))

  cat("Calculating offensive rushing stats...\n")
  all_teams <- unique(pbp_data$posteam[!is.na(pbp_data$posteam)])

  off_rush_stats <- pbp_data %>%
    filter(
      !is.na(posteam),
      (two_point_attempt != 1 | is.na(two_point_attempt)),
      !is.na(rushing_yards),
      !is.na(rusher_player_name)
    ) %>%
    distinct(game_id, play_id, .keep_all = TRUE) %>%
    mutate(
      # Include lateral rushing yards
      total_rushing_yards = rushing_yards + coalesce(lateral_rushing_yards, 0),
      is_stuff = total_rushing_yards <= 0,
      is_10_plus = total_rushing_yards >= 10,
      is_20_plus = total_rushing_yards >= 20,
      is_success = coalesce(success == 1, FALSE)
    ) %>%
    group_by(team_id = posteam, week) %>%
    summarise(
      off_rush_attempts = n(),
      off_rush_yards = sum(total_rushing_yards, na.rm = TRUE),
      off_rush_touchdowns = sum(rush_touchdown, na.rm = TRUE),
      off_rush_stuffs = sum(is_stuff, na.rm = TRUE),
      off_rush_10_plus = sum(is_10_plus, na.rm = TRUE),
      off_rush_20_plus = sum(is_20_plus, na.rm = TRUE),
      off_rush_first_downs = sum(first_down_rush, na.rm = TRUE),
      off_rush_epa_total = round(sum(epa, na.rm = TRUE), 2),
      off_rush_success_total = sum(is_success, na.rm = TRUE),
      .groups = "drop"
    ) %>%
    mutate(week = as.integer(week))

  cat("Calculating offensive drives and situational stats...\n")
  team_offense <- pbp_data %>%
    filter(
      !is.na(posteam),
      play_type %in% c("pass", "run", "qb_kneel", "qb_spike"),
      !is.na(down),
      (two_point_attempt != 1 | is.na(two_point_attempt))
    ) %>%
    distinct(game_id, play_id, .keep_all = TRUE) %>%
    mutate(
      is_early_down = down %in% c(1, 2),
      is_late_down = down %in% c(3, 4)
    )

  all_teams_weeks <- team_offense %>%
    distinct(posteam, week) %>%
    filter(!is.na(posteam))

  off_situational_stats <- team_offense %>%
    group_by(team_id = posteam, week) %>%
    summarise(
      off_third_down_attempts = sum(down == 3, na.rm = TRUE),
      off_third_down_conversions = sum(third_down_converted == 1, na.rm = TRUE),
      off_fourth_down_attempts = sum(down == 4, na.rm = TRUE),
      off_fourth_down_conversions = sum(fourth_down_converted == 1, na.rm = TRUE),
      off_early_down_total = sum(is_early_down, na.rm = TRUE),
      off_early_down_epa = round(sum(epa[is_early_down], na.rm = TRUE), 4),
      off_early_down_success = sum(success[is_early_down] == 1, na.rm = TRUE),
      off_late_down_total = sum(is_late_down, na.rm = TRUE),
      off_late_down_epa = round(sum(epa[is_late_down], na.rm = TRUE), 4),
      off_late_down_success = sum(success[is_late_down] == 1, na.rm = TRUE),
      .groups = "drop"
    ) %>%
    mutate(week = as.integer(week))

  off_basic_stats <- pbp_data %>%
    filter(
      !is.na(posteam),
      play == 1,
      (two_point_attempt != 1 | is.na(two_point_attempt))
    ) %>%
    distinct(game_id, play_id, .keep_all = TRUE) %>%
    group_by(team_id = posteam, week) %>%
    summarise(
      off_fumbles = sum(fumble, na.rm = TRUE),
      off_fumbles_lost = sum(fumble_lost, na.rm = TRUE),
      off_turnovers = sum(interception, na.rm = TRUE) + sum(fumble_lost, na.rm = TRUE),
      .groups = "drop"
    ) %>%
    mutate(week = as.integer(week))

  off_other_stats <- off_situational_stats %>%
    left_join(off_basic_stats, by = c("team_id", "week"))

  three_and_outs <- pbp_data %>%
    filter(!is.na(posteam)) %>%
    group_by(team_id = posteam, week, game_id, drive) %>%
    summarise(
      plays_in_drive = sum(play == 1, na.rm = TRUE),
      first_downs_in_drive = sum(first_down, na.rm = TRUE),
      .groups = "drop"
    ) %>%
    filter(plays_in_drive == 3, first_downs_in_drive == 0) %>%
    group_by(team_id, week) %>%
    summarise(off_three_and_outs = n(), .groups = "drop") %>%
    mutate(week = as.integer(week))

  scoring_stats <- pbp_data %>%
    filter(
      ((!is.na(posteam_score_post) & !is.na(posteam_score) & posteam_score_post > posteam_score & !is.na(posteam)) |
       (!is.na(defteam_score_post) & !is.na(defteam_score) & defteam_score_post > defteam_score & !is.na(defteam)))
    ) %>%
    mutate(
      team_id = case_when(
        !is.na(posteam) & posteam_score_post > posteam_score ~ posteam,
        !is.na(defteam) & defteam_score_post > defteam_score ~ defteam,
        TRUE ~ NA_character_
      ),
      points_scored = case_when(
        !is.na(posteam) & posteam_score_post > posteam_score ~ posteam_score_post - posteam_score,
        !is.na(defteam) & defteam_score_post > defteam_score ~ defteam_score_post - defteam_score,
        TRUE ~ 0
      )
    ) %>%
    filter(points_scored > 0, !is.na(team_id)) %>%
    group_by(team_id, week) %>%
    summarise(off_points_total = sum(points_scored, na.rm = TRUE), .groups = "drop") %>%
    mutate(week = as.integer(week))

  drive_stats <- pbp_data %>%
    filter(
      !is.na(posteam),
      !is.na(drive),
      !is.na(game_id),
      play == 1
    ) %>%
    group_by(team_id = posteam, week) %>%
    summarise(
      off_drives_total = n_distinct(paste(game_id, drive)),
      .groups = "drop"
    ) %>%
    mutate(week = as.integer(week))

  cat("Calculating defensive passing stats...\n")
  def_pass_dropbacks_data <- pbp_reg %>%
    filter(
      !is.na(defteam),
      (qb_dropback == 1 | qb_spike == 1) | (qb_scramble == 1)
    ) %>%
    mutate(
      is_20_plus = ifelse(!is.na(passing_yards) & passing_yards >= 20, TRUE, FALSE),
      is_success = ifelse(!is.na(success), success == 1, FALSE),
      yac = ifelse(!is.na(yards_after_catch), yards_after_catch, 0)
    )

  # Pass attempts from original data to match nflverse reference
  def_pass_attempts_data <- pbp_data %>%
    filter(
      (two_point_attempt != 1 | is.na(two_point_attempt)),
      !is.na(defteam),
      pass_attempt == 1,
      (is.na(sack) | sack == 0)
    ) %>%
    group_by(team_id = defteam, week) %>%
    summarise(def_pass_attempts = n(), .groups = "drop") %>%
    mutate(week = as.integer(week))

  def_pass_stats <- def_pass_dropbacks_data %>%
    group_by(team_id = defteam, week) %>%
    summarise(
      def_pass_dropbacks = n(),
      def_pass_yards = sum(passing_yards, na.rm = TRUE),
      def_pass_completions = sum(complete_pass, na.rm = TRUE),
      def_pass_touchdowns = sum(pass_touchdown, na.rm = TRUE),
      def_pass_ints = sum(interception, na.rm = TRUE),
      def_pass_sacks = sum(sack, na.rm = TRUE),
      def_pass_sack_yards = abs(sum(ifelse(sack == 1, yards_gained, 0), na.rm = TRUE)),
      def_pass_air_yards = sum(air_yards, na.rm = TRUE),
      def_pass_qb_hit = sum(qb_hit == 1 & sack != 1, na.rm = TRUE),
      def_pass_first_downs = sum(first_down_pass, na.rm = TRUE),
      def_pass_yac_total = sum(yac, na.rm = TRUE),
      def_pass_epa = round(sum(ifelse(qb_scramble != 1, epa, 0), na.rm = TRUE), 4),
      def_pass_success_total = sum(ifelse(qb_scramble != 1 & success == 1, 1, 0), na.rm = TRUE),
      def_pass_20_plus = sum(is_20_plus, na.rm = TRUE),
      .groups = "drop"
    ) %>%
    mutate(week = as.integer(week)) %>%
    left_join(def_pass_attempts_data, by = c("team_id", "week")) %>%
    mutate(def_pass_attempts = replace_na(def_pass_attempts, 0))

  cat("Calculating defensive rushing stats...\n")
  def_rush_stats <- pbp_data %>%
    filter(
      !is.na(defteam),
      (two_point_attempt != 1 | is.na(two_point_attempt)),
      !is.na(rushing_yards),
      !is.na(rusher_player_name)
    ) %>%
    distinct(game_id, play_id, .keep_all = TRUE) %>%
    mutate(
      is_stuff = rushing_yards <= 0,
      is_10_plus = rushing_yards >= 10,
      is_20_plus = rushing_yards >= 20,
      is_success = coalesce(success == 1, FALSE)
    ) %>%
    group_by(team_id = defteam, week) %>%
    summarise(
      def_rush_attempts = n(),
      def_rush_yards = sum(rushing_yards, na.rm = TRUE),
      def_rush_touchdowns = sum(rush_touchdown, na.rm = TRUE),
      def_rush_stuffs = sum(is_stuff, na.rm = TRUE),
      def_rush_10_plus = sum(is_10_plus, na.rm = TRUE),
      def_rush_20_plus = sum(is_20_plus, na.rm = TRUE),
      def_rush_first_downs = sum(first_down_rush, na.rm = TRUE),
      def_rush_epa_total = round(sum(epa, na.rm = TRUE), 2),
      def_rush_success_total = sum(is_success, na.rm = TRUE),
      .groups = "drop"
    ) %>%
    mutate(week = as.integer(week))

  cat("Calculating defensive situational stats...\n")
  team_defense <- pbp_data %>%
    filter(
      !is.na(defteam),
      play_type %in% c("pass", "run", "qb_kneel", "qb_spike"),
      !is.na(down),
      (two_point_attempt != 1 | is.na(two_point_attempt))
    ) %>%
    distinct(game_id, play_id, .keep_all = TRUE) %>%
    mutate(
      is_early_down = down %in% c(1, 2),
      is_late_down = down %in% c(3, 4)
    )

  def_situational_stats <- team_defense %>%
    group_by(team_id = defteam, week) %>%
    summarise(
      def_third_down_attempts = sum(down == 3, na.rm = TRUE),
      def_third_down_conversions = sum(third_down_converted == 1, na.rm = TRUE),
      def_fourth_down_attempts = sum(down == 4, na.rm = TRUE),
      def_fourth_down_conversions = sum(fourth_down_converted == 1, na.rm = TRUE),
      def_early_down_total = sum(is_early_down, na.rm = TRUE),
      def_early_down_epa = round(sum(epa[is_early_down], na.rm = TRUE), 4),
      def_early_down_success = sum(success[is_early_down] == 1, na.rm = TRUE),
      def_late_down_total = sum(is_late_down, na.rm = TRUE),
      def_late_down_epa = round(sum(epa[is_late_down], na.rm = TRUE), 4),
      def_late_down_success = sum(success[is_late_down] == 1, na.rm = TRUE),
      .groups = "drop"
    ) %>%
    mutate(week = as.integer(week))

  def_basic_stats <- pbp_data %>%
    filter(
      !is.na(defteam),
      play == 1,
      (two_point_attempt != 1 | is.na(two_point_attempt))
    ) %>%
    distinct(game_id, play_id, .keep_all = TRUE) %>%
    group_by(team_id = defteam, week) %>%
    summarise(
      def_fumbles = sum(fumble, na.rm = TRUE) - sum(fumble_lost, na.rm = TRUE),
      def_fumbles_lost = sum(fumble_lost, na.rm = TRUE),
      def_turnovers = sum(interception, na.rm = TRUE) + sum(fumble_lost, na.rm = TRUE),
      .groups = "drop"
    ) %>%
    mutate(week = as.integer(week))

  def_three_and_outs <- pbp_data %>%
    filter(!is.na(defteam)) %>%
    group_by(team_id = defteam, week, game_id, drive) %>%
    summarise(
      plays_in_drive = sum(play == 1, na.rm = TRUE),
      first_downs_in_drive = sum(first_down, na.rm = TRUE),
      .groups = "drop"
    ) %>%
    filter(plays_in_drive == 3, first_downs_in_drive == 0) %>%
    group_by(team_id, week) %>%
    summarise(def_three_and_outs = n(), .groups = "drop") %>%
    mutate(week = as.integer(week))

  def_scoring_stats <- pbp_data %>%
    filter(
      ((!is.na(posteam_score_post) & !is.na(posteam_score) & posteam_score_post > posteam_score & !is.na(defteam)) |
       (!is.na(defteam_score_post) & !is.na(defteam_score) & defteam_score_post > defteam_score & !is.na(posteam)))
    ) %>%
    mutate(
      team_id = case_when(
        !is.na(defteam) & posteam_score_post > posteam_score ~ defteam,
        !is.na(posteam) & defteam_score_post > defteam_score ~ posteam,
        TRUE ~ NA_character_
      ),
      points_allowed = case_when(
        !is.na(defteam) & posteam_score_post > posteam_score ~ posteam_score_post - posteam_score,
        !is.na(posteam) & defteam_score_post > defteam_score ~ defteam_score_post - defteam_score,
        TRUE ~ 0
      )
    ) %>%
    filter(points_allowed > 0, !is.na(team_id)) %>%
    group_by(team_id, week) %>%
    summarise(def_points_total = sum(points_allowed, na.rm = TRUE), .groups = "drop") %>%
    mutate(week = as.integer(week))

  def_drive_stats <- pbp_data %>%
    filter(
      !is.na(defteam),
      !is.na(drive),
      !is.na(game_id),
      play == 1
    ) %>%
    group_by(team_id = defteam, week) %>%
    summarise(
      def_drives_total = n_distinct(paste(game_id, drive)),
      .groups = "drop"
    ) %>%
    mutate(week = as.integer(week))

  def_other_stats <- def_situational_stats %>%
    left_join(def_basic_stats, by = c("team_id", "week")) %>%
    left_join(def_three_and_outs, by = c("team_id", "week")) %>%
    left_join(def_scoring_stats, by = c("team_id", "week")) %>%
    left_join(def_drive_stats, by = c("team_id", "week"))

  cat("Combining all team stats...\n")
  all_team_weeks <- bind_rows(
    select(off_pass_stats, team_id, week),
    select(off_rush_stats, team_id, week),
    select(def_pass_stats, team_id, week),
    select(def_rush_stats, team_id, week),
    select(def_other_stats, team_id, week)
  ) %>%
    distinct() %>%
    filter(!is.na(team_id))

  final_stats <- all_team_weeks %>%
    left_join(off_pass_stats, by = c("team_id", "week")) %>%
    left_join(off_rush_stats, by = c("team_id", "week")) %>%
    left_join(off_other_stats, by = c("team_id", "week")) %>%
    left_join(three_and_outs, by = c("team_id", "week")) %>%
    left_join(scoring_stats, by = c("team_id", "week")) %>%
    left_join(drive_stats, by = c("team_id", "week")) %>%
    left_join(def_pass_stats, by = c("team_id", "week")) %>%
    left_join(def_rush_stats, by = c("team_id", "week")) %>%
    left_join(def_other_stats, by = c("team_id", "week")) %>%
    mutate(across(where(is.numeric), ~replace_na(.x, 0))) %>%
    mutate(across(c(contains("attempts"), contains("completions"), contains("yards"),
                    contains("touchdowns"), contains("ints"), contains("sacks"),
                    contains("hits"), contains("first_downs"), contains("success"),
                    contains("plus"), contains("stuffs"), contains("fumbles"),
                    contains("drives"), contains("points"), contains("turnovers"),
                    contains("conversions"), contains("outs")) &
                    !contains("epa"), as.integer)) %>%
    mutate(
      season = season,
      win = FALSE,
      loss = FALSE,
      tie = FALSE
    ) %>%
    select(
      team_id, season, week, win, loss, tie,
      everything()
    )

  cat(paste("Transformed", nrow(final_stats), "team-week records\n"))
  final_stats
}
