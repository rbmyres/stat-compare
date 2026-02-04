# Player Receiving Statistics Analysis 2024
# Uses nflverse play-by-play data to calculate detailed receiving stats
# Change the player_name variable to analyze different receivers

# Load required libraries
library(nflreadr)
library(dplyr)

# CHANGE THIS TO ANALYZE DIFFERENT PLAYERS
player_name <- "M.Andrews"  # Example: Mark Andrews

# Load 2024 play-by-play data
pbp_2024 <- load_pbp(2024)

# Filter for player's receiving targets
player_receiving <- pbp_2024 %>%
  filter(
    receiver_player_name == player_name,
    !is.na(pass_attempt),
    pass_attempt == 1,
    season_type == "REG",
    (two_point_attempt != 1 | is.na(two_point_attempt))
  ) %>%
  distinct(game_id, play_id, .keep_all = TRUE) %>%
  mutate(
    is_target = 1,
    is_reception = ifelse(complete_pass == 1, 1, 0),
    is_20_plus = ifelse(!is.na(receiving_yards) & receiving_yards >= 20, TRUE, FALSE),
    is_success = ifelse(!is.na(success), success == 1, FALSE),
    yac = ifelse(!is.na(yards_after_catch), yards_after_catch, 0)
  )

# Calculate weekly statistics
weekly_stats <- player_receiving %>%
  group_by(week) %>%
  summarise(
    rec_targets = sum(is_target),
    rec_receptions = sum(is_reception, na.rm = TRUE),
    rec_yards = sum(receiving_yards, na.rm = TRUE),
    rec_touchdowns = sum(pass_touchdown, na.rm = TRUE),
    rec_yac_total = sum(yac, na.rm = TRUE),
    rec_first_downs = sum(first_down_pass, na.rm = TRUE),
    rec_epa_total = round(sum(ifelse(complete_pass == 1, epa, 0), na.rm = TRUE), 2),
    rec_wpa_total = round(sum(ifelse(complete_pass == 1, wpa, 0), na.rm = TRUE), 2),
    rec_success_total = sum(is_success, na.rm = TRUE),
    rec_yac_epa_total = round(sum(yac_epa, na.rm = TRUE), 2),
    rec_yac_wpa_total = round(sum(yac_wpa, na.rm = TRUE), 2),
    rec_20_plus = sum(is_20_plus, na.rm = TRUE),
    rec_long = ifelse(any(!is.na(receiving_yards)), max(receiving_yards, na.rm = TRUE), 0),
    rec_air_yards_total = sum(air_yards, na.rm = TRUE),
    rec_fumbles = sum(fumble, na.rm = TRUE),
    rec_fumbles_lost = sum(fumble_lost, na.rm = TRUE)
  ) %>%
  arrange(week) %>%
  mutate(week = as.character(week))

# Calculate season totals
season_totals <- weekly_stats %>%
  summarise(
    week = "Total",
    across(where(is.numeric), ~if(cur_column() == "rec_long") max(.) else sum(.))
  )

# Combine weekly stats with season totals
final_table <- bind_rows(weekly_stats, season_totals)

# Display the results
cat("Receiving Statistics for:", player_name, "\n\n")
print(final_table)

# Optional: View in RStudio's data viewer
View(final_table)