# Team Offense Rushing Statistics Analysis 2024
# Uses nflverse play-by-play data to calculate team rushing offense stats

# Load required libraries
library(nflreadr)
library(dplyr)

# CHANGE THIS TO ANALYZE DIFFERENT TEAMS
team_abbr <- "BAL"  # Example: Baltimore Ravens

# Load 2024 play-by-play data
pbp_2024 <- load_pbp(2024)

# Filter for team's offensive rushing plays (including all rushing attempts)
team_rushing <- pbp_2024 %>%
  filter(
    posteam == team_abbr,
    season_type == "REG",
    (two_point_attempt != 1 | is.na(two_point_attempt)),
    !is.na(rushing_yards),
    !is.na(rusher_player_name)
  ) %>%
  distinct(game_id, play_id, .keep_all = TRUE) %>%
  mutate(
    is_stuff = rushing_yards <= 0,
    is_10_plus = rushing_yards >= 10,
    is_20_plus = rushing_yards >= 20,
    is_success = ifelse(!is.na(success), success == 1, FALSE)
  )

# Calculate weekly statistics
weekly_stats <- team_rushing %>%
  group_by(week) %>%
  summarise(
    off_rush_attempts = n(),
    off_rush_yards = sum(rushing_yards, na.rm = TRUE),
    off_rush_touchdowns = sum(rush_touchdown, na.rm = TRUE),
    off_rush_stuffs = sum(is_stuff, na.rm = TRUE),
    off_rush_10_plus = sum(is_10_plus, na.rm = TRUE),
    off_rush_20_plus = sum(is_20_plus, na.rm = TRUE),
    off_rush_first_downs = sum(first_down_rush, na.rm = TRUE),
    off_rush_epa_total = round(sum(epa, na.rm = TRUE), 2),
    off_rush_success_total = sum(is_success, na.rm = TRUE),
    off_rush_wpa_total = round(sum(wpa, na.rm = TRUE), 2)
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
cat("Offensive Rushing Statistics for:", team_abbr, "\n\n")
print(final_table)

# Optional: View in RStudio's data viewer
View(final_table)