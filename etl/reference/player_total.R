# Player Total Statistics Analysis 2024
# Combines passing, rushing, and receiving stats for overall player production
# Change the player_name variable to analyze different players

# Load required libraries
library(nflreadr)
library(dplyr)

# CHANGE THIS TO ANALYZE DIFFERENT PLAYERS
player_name <- "L.Jackson"  # Example: Lamar Jackson

# Load 2024 play-by-play data
pbp_2024 <- load_pbp(2024)

# Get all plays where player was involved
player_plays <- pbp_2024 %>%
  filter(
    (passer_player_name == player_name & pass_attempt == 1) |
    rusher_player_name == player_name |
    receiver_player_name == player_name,
    season_type == "REG",
    (two_point_attempt != 1 | is.na(two_point_attempt))
  ) %>%
  distinct(game_id, play_id, .keep_all = TRUE) %>%
  mutate(
    # Identify play types
    is_pass = (passer_player_name == player_name & pass_attempt == 1 & sack == 0),
    is_rush = (rusher_player_name == player_name),
    is_rec = (receiver_player_name == player_name & complete_pass == 1),
    is_scrimmage = (is_rush | is_rec),
    
    # Calculate yards
    yards = case_when(
      is_pass ~ passing_yards,
      is_rush ~ rushing_yards,
      is_rec ~ receiving_yards,
      TRUE ~ 0
    ),
    
    # Calculate touchdowns
    td = case_when(
      is_pass ~ pass_touchdown,
      is_rush ~ rush_touchdown,
      is_rec ~ pass_touchdown,
      TRUE ~ 0
    ),
    
    # Success metric
    is_success = ifelse(!is.na(success), success == 1, FALSE)
  )

# Calculate weekly statistics
weekly_stats <- player_plays %>%
  group_by(week) %>%
  summarise(
    # Total stats (passing + rushing + receiving)
    total_yards = sum(yards, na.rm = TRUE),
    total_plays = n(),
    total_touchdowns = sum(td, na.rm = TRUE),
    total_epa = round(sum(epa, na.rm = TRUE), 2),
    total_wpa = round(sum(wpa, na.rm = TRUE), 2),
    total_first_downs = sum(first_down, na.rm = TRUE),
    total_success_plays = sum(is_success, na.rm = TRUE),
    total_fumbles = sum(fumble, na.rm = TRUE),
    total_fumbles_lost = sum(fumble_lost, na.rm = TRUE),
    
    # Scrimmage stats (rushing + receiving only)
    scrim_yards = sum(yards[is_scrimmage], na.rm = TRUE),
    scrim_touches = sum(is_scrimmage, na.rm = TRUE),
    scrim_touchdowns = sum(td[is_scrimmage], na.rm = TRUE),
    scrim_epa_total = round(sum(epa[is_scrimmage], na.rm = TRUE), 2),
    scrim_wpa_total = round(sum(wpa[is_scrimmage], na.rm = TRUE), 2),
    scrim_first_downs = sum(first_down[is_scrimmage], na.rm = TRUE),
    scrim_success_total = sum(is_success[is_scrimmage], na.rm = TRUE)
  ) %>%
  arrange(week) %>%
  mutate(week = as.character(week))

# Calculate season totals
season_totals <- weekly_stats %>%
  summarise(
    week = "Total",
    across(where(is.numeric), sum)
  )

# Combine weekly stats with season totals
final_table <- bind_rows(weekly_stats, season_totals)

# Display the results
cat("Total Statistics for:", player_name, "\n\n")
print(final_table)

# Optional: View in RStudio's data viewer
View(final_table)