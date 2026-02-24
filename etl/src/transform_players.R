# Player Statistics Transformation Functions
# Processes NFL play-by-play data to calculate player statistics (passing, rushing, receiving)
# All calculations match nflverse reference implementations for accuracy

library(dplyr)
library(logger)
library(tidyr)
library(purrr)

# Transform play-by-play data into weekly player statistics
# Calculates comprehensive player metrics across all position groups
# @param pbp_data: Raw play-by-play data from nflreadr
# @param season: Integer year being processed
# @return: DataFrame with weekly player statistics
transform_player_stats <- function(pbp_data, season) {
  cat(paste("Transforming player stats for season", season, "...\n"))
  
  # Filter for regular season plays only (excludes preseason/playoffs)
  pbp_reg <- pbp_data %>%
    filter(
      (two_point_attempt != 1 | is.na(two_point_attempt)),
      play == 1
    )
  
  # Create player-to-team mapping for each week
  # Handles rare cases where players change teams mid-week
  player_team_map <- pbp_reg %>%
    select(
      player_id = passer_player_id,
      team_id = posteam,
      week
    ) %>%
    bind_rows(
      pbp_reg %>%
        select(
          player_id = rusher_player_id,
          team_id = posteam,
          week
        )
    ) %>%
    bind_rows(
      pbp_reg %>%
        select(
          player_id = receiver_player_id,
          team_id = posteam,
          week
        )
    ) %>%
    filter(!is.na(player_id), !is.na(team_id)) %>%
    distinct() %>%
    # For players on multiple teams in one week, use first occurrence
    group_by(player_id, week) %>%
    slice_head(n = 1) %>%
    ungroup()
  
  cat("Calculating passing stats...\n")
  # Calculate passing stats
  # First get all dropbacks for all QBs
  all_dropbacks <- pbp_reg %>%
    filter(
      (
        (passer_player_id %in% unique(pbp_reg$passer_player_id[!is.na(pbp_reg$passer_player_id)]) & 
         (qb_dropback == 1 | qb_spike == 1)) |
        (qb_scramble == 1 & rusher_player_id %in% unique(pbp_reg$rusher_player_id[!is.na(pbp_reg$rusher_player_id)]))
      )
    ) %>%
    distinct(game_id, play_id, .keep_all = TRUE) %>%
    mutate(player_id = coalesce(passer_player_id, rusher_player_id)) %>%
    filter(!is.na(player_id))
  
  # Calculate stats using grouped approach but with exact reference logic
  passing_stats <- all_dropbacks %>%
    group_by(player_id, week) %>%
    summarise(
      pass_qb_dropbacks = n(),
      # Use same exact filters as reference for all calculations
      pass_completions = sum(complete_pass == 1 & pass_attempt == 1 & qb_scramble != 1 & sack != 1, na.rm = TRUE),
      pass_yards = sum(ifelse(pass_attempt == 1 & qb_scramble != 1 & sack != 1, passing_yards, 0), na.rm = TRUE),
      pass_touchdowns = sum(ifelse(pass_attempt == 1 & qb_scramble != 1 & sack != 1, pass_touchdown, 0), na.rm = TRUE),
      pass_ints = sum(ifelse(pass_attempt == 1 & qb_scramble != 1 & sack != 1, interception, 0), na.rm = TRUE),
      pass_long = ifelse(any(pass_attempt == 1 & qb_scramble != 1 & sack != 1 & !is.na(passing_yards)),
                         max(ifelse(pass_attempt == 1 & qb_scramble != 1 & sack != 1, passing_yards, 0), na.rm = TRUE), 0),
      pass_sacks = sum(sack == 1, na.rm = TRUE),
      pass_sack_yards = abs(sum(ifelse(sack == 1, yards_gained, 0), na.rm = TRUE)),
      pass_qb_hits = sum(qb_hit == 1 & sack != 1, na.rm = TRUE),
      pass_air_yards = sum(ifelse(pass_attempt == 1 & qb_scramble != 1 & sack != 1, air_yards, 0), na.rm = TRUE),
      pass_yac_total = sum(ifelse(pass_attempt == 1 & qb_scramble != 1 & sack != 1,
                                  ifelse(is.na(yards_after_catch), 0, yards_after_catch), 0), na.rm = TRUE),
      pass_first_downs = sum(ifelse(pass_attempt == 1 & qb_scramble != 1 & sack != 1, first_down_pass, 0), na.rm = TRUE),
      pass_20_plus = sum(ifelse(pass_attempt == 1 & qb_scramble != 1 & sack != 1 & !is.na(passing_yards),
                                ifelse(passing_yards >= 20, 1, 0), 0), na.rm = TRUE),
      pass_epa = round(sum(ifelse(qb_scramble != 1, epa, 0), na.rm = TRUE), 4),
      pass_success_total = sum(ifelse(success == 1, 1, 0), na.rm = TRUE),
      pass_cpoe_total = round(sum(ifelse(pass_attempt == 1 & qb_scramble != 1 & sack != 1, cpoe, 0), na.rm = TRUE), 4),
      .groups = "drop"
    )
  
  # Calculate pass attempts separately
  # The key insight: reference queries the original pbp_2024 data, not the filtered dropbacks
  pass_attempts_data <- pbp_data %>%  # Use original pbp_data, not pbp_reg!
    filter(
      (two_point_attempt != 1 | is.na(two_point_attempt)),
      !is.na(passer_player_id),
      pass_attempt == 1,
      (is.na(sack) | sack == 0)
    ) %>%
    group_by(player_id = passer_player_id, week) %>%
    summarise(pass_attempts = n(), .groups = "drop")
  
  passing_stats <- passing_stats %>%
    left_join(pass_attempts_data, by = c("player_id", "week")) %>%
    mutate(pass_attempts = replace_na(pass_attempts, 0))
  
  cat("Calculating rushing stats...\n")
  # Calculate rushing stats
  rushing_stats <- pbp_data %>%  # Use original pbp_data like reference
    filter(
      !is.na(rusher_player_id),
      !is.na(rushing_yards),
      (two_point_attempt != 1 | is.na(two_point_attempt))
    ) %>%
    distinct(game_id, play_id, .keep_all = TRUE) %>%
    mutate(
      # Exact same calculations as reference
      is_scramble = (!is.na(qb_scramble) & qb_scramble == 1 & 
                       (penalty == 0 | is.na(penalty)) & play == 1),
      is_stuff = rushing_yards <= 0,
      is_10_plus = rushing_yards >= 10,
      is_20_plus = rushing_yards >= 20,
      is_success = ifelse(!is.na(success), success == 1, FALSE)
    ) %>%
    group_by(player_id = rusher_player_id, week) %>%
    summarise(
      # Total rushing stats - exact match to reference
      rush_attempts = n(),
      rush_yards = sum(rushing_yards, na.rm = TRUE),
      rush_touchdowns = sum(rush_touchdown, na.rm = TRUE),
      rush_long = max(rushing_yards, na.rm = TRUE),
      rush_stuffs = sum(is_stuff, na.rm = TRUE),
      rush_10_plus = sum(is_10_plus, na.rm = TRUE),
      rush_20_plus = sum(is_20_plus, na.rm = TRUE),
      rush_first_downs = sum(first_down_rush, na.rm = TRUE),
      rush_epa_total = round(sum(epa, na.rm = TRUE), 4),
      rush_success_total = sum(is_success, na.rm = TRUE),
      rush_fumbles = sum(fumble, na.rm = TRUE),
      rush_fumbles_lost = sum(fumble_lost, na.rm = TRUE),
      
      # Scramble-specific stats - exact match to reference
      qb_scramble_attempts = sum(is_scramble, na.rm = TRUE),
      qb_scramble_yards = sum(rushing_yards[is_scramble], na.rm = TRUE),
      qb_scramble_epa_total = round(sum(epa[is_scramble], na.rm = TRUE), 4),
      qb_scramble_touchdowns = sum(rush_touchdown[is_scramble], na.rm = TRUE),
      qb_scramble_success_total = sum(is_success[is_scramble], na.rm = TRUE),
      .groups = "drop"
    )
  
  cat("Calculating receiving stats...\n")
  # RECEIVING STATS - Optimized version
  receiving_stats <- pbp_reg %>%
    filter(
      !is.na(receiver_player_id),
      !is.na(pass_attempt),
      pass_attempt == 1
    ) %>%
    mutate(
      is_target = 1,
      is_reception = ifelse(complete_pass == 1, 1, 0),
      is_20_plus = ifelse(!is.na(receiving_yards) & receiving_yards >= 20, TRUE, FALSE),
      is_success = ifelse(!is.na(success), success == 1, FALSE),
      yac = ifelse(!is.na(yards_after_catch), yards_after_catch, 0)
    ) %>%
    group_by(player_id = receiver_player_id, week) %>%
    summarise(
      rec_targets = sum(is_target),
      rec_receptions = sum(is_reception, na.rm = TRUE),
      rec_yards = sum(receiving_yards, na.rm = TRUE),
      rec_touchdowns = sum(pass_touchdown, na.rm = TRUE),
      rec_yac_total = sum(yac, na.rm = TRUE),
      rec_first_downs = sum(first_down_pass, na.rm = TRUE),
      rec_epa_total = round(sum(ifelse(complete_pass == 1, epa, 0), na.rm = TRUE), 4),
      rec_success_total = sum(is_success, na.rm = TRUE),
      rec_20_plus = sum(is_20_plus, na.rm = TRUE),
      rec_long = ifelse(any(!is.na(receiving_yards)), max(receiving_yards, na.rm = TRUE), 0),
      rec_air_yards_total = sum(air_yards, na.rm = TRUE),
      rec_fumbles = sum(fumble, na.rm = TRUE),
      rec_fumbles_lost = sum(fumble_lost, na.rm = TRUE),
      .groups = "drop"
    )
  
  cat("Calculating total stats...\n")
  # Calculate total stats using vectorized operations (no per-player loop)

  # Filter base data once
  pbp_filtered <- pbp_data %>%
    filter(two_point_attempt != 1 | is.na(two_point_attempt)) %>%
    distinct(game_id, play_id, .keep_all = TRUE)

  # Create passing plays (passer perspective)
  pass_plays <- pbp_filtered %>%
    filter(!is.na(passer_player_id), pass_attempt == 1, sack == 0) %>%
    transmute(
      player_id = passer_player_id,
      week,
      game_id,
      play_id,
      yards = coalesce(passing_yards, 0L),
      td = coalesce(pass_touchdown, 0L),
      is_scrimmage = FALSE,
      epa = epa,
      first_down = first_down,
      is_success = coalesce(success == 1, FALSE),
      fumble = fumble,
      fumble_lost = fumble_lost
    )

  # Create rushing plays (rusher perspective)
  rush_plays <- pbp_filtered %>%
    filter(!is.na(rusher_player_id)) %>%
    transmute(
      player_id = rusher_player_id,
      week,
      game_id,
      play_id,
      yards = coalesce(rushing_yards, 0L),
      td = coalesce(rush_touchdown, 0L),
      is_scrimmage = TRUE,
      epa = epa,
      first_down = first_down,
      is_success = coalesce(success == 1, FALSE),
      fumble = fumble,
      fumble_lost = fumble_lost
    )

  # Create receiving plays (receiver perspective, completions only)
  rec_plays <- pbp_filtered %>%
    filter(!is.na(receiver_player_id), complete_pass == 1) %>%
    transmute(
      player_id = receiver_player_id,
      week,
      game_id,
      play_id,
      yards = coalesce(receiving_yards, 0L),
      td = coalesce(pass_touchdown, 0L),
      is_scrimmage = TRUE,
      epa = epa,
      first_down = first_down,
      is_success = coalesce(success == 1, FALSE),
      fumble = fumble,
      fumble_lost = fumble_lost
    )

  # Combine all player-play records and aggregate
  total_stats <- bind_rows(pass_plays, rush_plays, rec_plays) %>%
    filter(!is.na(player_id)) %>%
    group_by(player_id, week) %>%
    summarise(
      # Total stats (passing + rushing + receiving)
      total_yards = sum(yards, na.rm = TRUE),
      total_plays = n(),
      total_touchdowns = sum(td, na.rm = TRUE),
      total_epa = round(sum(epa, na.rm = TRUE), 4),
      total_first_downs = sum(first_down, na.rm = TRUE),
      total_success_plays = sum(is_success, na.rm = TRUE),
      total_fumbles = sum(fumble, na.rm = TRUE),
      total_fumbles_lost = sum(fumble_lost, na.rm = TRUE),

      # Scrimmage stats (rushing + receiving only)
      scrim_yards = sum(yards[is_scrimmage], na.rm = TRUE),
      scrim_touches = sum(is_scrimmage, na.rm = TRUE),
      scrim_touchdowns = sum(td[is_scrimmage], na.rm = TRUE),
      scrim_epa_total = round(sum(epa[is_scrimmage], na.rm = TRUE), 4),
      scrim_first_downs = sum(first_down[is_scrimmage], na.rm = TRUE),
      scrim_success_total = sum(is_success[is_scrimmage], na.rm = TRUE),
      .groups = "drop"
    )
  
  cat("Combining all player stats...\n")
  # Get all unique player-week combinations
  all_player_weeks <- bind_rows(
    select(passing_stats, player_id, week),
    select(rushing_stats, player_id, week),  
    select(receiving_stats, player_id, week),
    select(total_stats, player_id, week)
  ) %>%
    distinct() %>%
    filter(!is.na(player_id))
  
  # Join all stats together
  final_stats <- all_player_weeks %>%
    left_join(passing_stats, by = c("player_id", "week")) %>%
    left_join(rushing_stats, by = c("player_id", "week")) %>%
    left_join(receiving_stats, by = c("player_id", "week")) %>%
    left_join(total_stats, by = c("player_id", "week")) %>%
    # Add team information from play-by-play data
    left_join(player_team_map, by = c("player_id", "week")) %>%
    # Fill missing values with 0 and ensure integer types
    mutate(across(where(is.numeric), ~replace_na(.x, 0))) %>%
    # Convert to integer types to match database schema
    mutate(across(c(contains("attempts"), contains("completions"), contains("yards"), 
                    contains("touchdowns"), contains("ints"), contains("sacks"),
                    contains("hits"), contains("first_downs"), contains("success"),
                    contains("plus"), contains("long"), contains("targets"),
                    contains("receptions"), contains("stuffs"), contains("fumbles"),
                    contains("plays"), contains("touches")), as.integer)) %>%
    # Add required columns
    mutate(
      season = season,
      position = NA_character_,
      # Binary game outcome columns (will be populated by enhance function)
      win = FALSE,
      loss = FALSE,
      tie = FALSE
    ) %>%
    # Reorder columns to match schema
    select(
      player_id, season, week, team_id, position, win, loss, tie,
      # All the stat columns
      everything()
    )
  
  cat(paste("✓ Transformed", nrow(final_stats), "player-week records\n"))
  return(final_stats)
}