# Lamar Jackson 2024 Rushing Statistics Analysis
# Uses nflverse play-by-play data to calculate detailed rushing stats

# Load required libraries
library(nflreadr)
library(dplyr)

# Load 2024 play-by-play data
pbp_2024 <- load_pbp(2024)

# Filter for Lamar Jackson's rushing attempts (both designed runs and scrambles)
lamar_rushing <- pbp_2024 %>%
  filter(
    rusher_player_name == "L.Jackson",
    !is.na(rushing_yards),
    season_type == "REG",
    (two_point_attempt != 1 | is.na(two_point_attempt))
  ) %>%
  distinct(game_id, play_id, .keep_all = TRUE) %>%
  mutate(
    # Identify scrambles vs designed runs
    is_scramble = (!is.na(qb_scramble) & qb_scramble == 1 & 
                     (penalty == 0 | is.na(penalty)) & play == 1),
    
    # Calculate additional metrics
    is_stuff = rushing_yards <= 0,
    is_10_plus = rushing_yards >= 10,
    is_20_plus = rushing_yards >= 20,
    is_success = ifelse(!is.na(success), success == 1, FALSE)
  )

# Calculate weekly statistics
weekly_stats <- lamar_rushing %>%
  group_by(week) %>%
  summarise(
    # Total rushing stats
    rush_attempts = n(),
    rush_yards = sum(rushing_yards, na.rm = TRUE),
    rush_touchdowns = sum(rush_touchdown, na.rm = TRUE),
    rush_long = max(rushing_yards, na.rm = TRUE),
    rush_stuffs = sum(is_stuff, na.rm = TRUE),
    rush_10_plus = sum(is_10_plus, na.rm = TRUE),
    rush_20_plus = sum(is_20_plus, na.rm = TRUE),
    rush_first_downs = sum(first_down_rush, na.rm = TRUE),
    rush_epa_total = round(sum(epa, na.rm = TRUE), 2),
    rush_wpa_total = round(sum(wpa, na.rm = TRUE), 2),
    rush_success_total = sum(is_success, na.rm = TRUE),
    rush_fumbles = sum(fumble, na.rm = TRUE),
    rush_fumbles_lost = sum(fumble_lost, na.rm = TRUE),
    
    # Scramble-specific stats
    qb_scramble_attempts = sum(is_scramble, na.rm = TRUE),
    qb_scramble_yards = sum(rushing_yards[is_scramble], na.rm = TRUE),
    qb_scramble_epa_total = round(sum(epa[is_scramble], na.rm = TRUE), 2),
    qb_scramble_touchdowns = sum(rush_touchdown[is_scramble], na.rm = TRUE),
    qb_scramble_wpa_total = round(sum(wpa[is_scramble], na.rm = TRUE), 2),
    qb_scramble_success_total = sum(is_success[is_scramble], na.rm = TRUE),
    
  ) %>%
  arrange(week) %>%
  mutate(week = as.character(week))

# Calculate season totals
season_totals <- weekly_stats %>%
  summarise(
    week = "Total",
    across(where(is.numeric), ~if(cur_column() == "rush_long") max(.) else sum(.))
  )

# Combine weekly stats with season totals
final_table <- bind_rows(weekly_stats, season_totals)

# Display the results
print(final_table)

# Optional: View in RStudio's data viewer
View(final_table)