# Team Offense Situational Statistics Analysis 2024
# Uses nflverse play-by-play data to calculate situational offensive performance

# Load required libraries
library(nflreadr)
library(dplyr)

# CHANGE THIS TO ANALYZE DIFFERENT TEAMS
team_abbr <- "BAL"  # Example: Baltimore Ravens

# Load 2024 play-by-play data
pbp_2024 <- load_pbp(2024)

# Filter for team's offensive plays
team_offense <- pbp_2024 %>%
  filter(
    posteam == team_abbr,
    season_type == "REG",
    play_type %in% c("pass", "run", "qb_kneel", "qb_spike"),
    !is.na(down),
    (two_point_attempt != 1 | is.na(two_point_attempt))
  ) %>%
  distinct(game_id, play_id, .keep_all = TRUE) %>%
  mutate(
    is_early_down = down %in% c(1, 2),
    is_late_down = down %in% c(3, 4)
  )

# Get three-and-out data
three_and_outs <- pbp_2024 %>%
  filter(
    posteam == team_abbr,
    season_type == "REG"
  ) %>%
  group_by(week, game_id, drive) %>%
  summarise(
    plays_in_drive = sum(play == 1, na.rm = TRUE),
    first_downs_in_drive = sum(first_down, na.rm = TRUE),
    .groups = "drop"
  ) %>%
  filter(plays_in_drive == 3, first_downs_in_drive == 0) %>%
  group_by(week) %>%
  summarise(three_and_outs = n())

# Calculate weekly statistics
weekly_stats <- team_offense %>%
  group_by(week) %>%
  summarise(
    # Third down stats  
    off_third_down_attempts = {
      current_week <- first(week)
      pbp_2024 %>%
        filter(posteam == team_abbr, season_type == "REG", week == current_week, down == 3,
               play_type %in% c("pass", "run", "qb_kneel", "qb_spike"),
               (two_point_attempt != 1 | is.na(two_point_attempt))) %>%
        nrow()
    },
    off_third_down_conversions = sum(third_down_converted == 1, na.rm = TRUE),
    
    # Fourth down stats
    off_fourth_down_attempts = {
      current_week <- first(week)
      pbp_2024 %>%
        filter(posteam == team_abbr, season_type == "REG", week == current_week, down == 4,
               play_type %in% c("pass", "run", "qb_kneel", "qb_spike"),
               (two_point_attempt != 1 | is.na(two_point_attempt))) %>%
        nrow()
    },
    off_fourth_down_conversions = sum(fourth_down_converted == 1, na.rm = TRUE),
    
    # Early down stats (1st and 2nd down)
    off_early_down_total = sum(is_early_down, na.rm = TRUE),
    off_early_down_epa = round(sum(epa[is_early_down], na.rm = TRUE), 2),
    off_early_down_success = sum(success[is_early_down] == 1, na.rm = TRUE),
    off_early_down_wpa = round(sum(wpa[is_early_down], na.rm = TRUE), 2),
    
    # Late down stats (3rd and 4th down)
    off_late_down_total = sum(is_late_down, na.rm = TRUE),
    off_late_down_epa = round(sum(epa[is_late_down], na.rm = TRUE), 2),
    off_late_down_success = sum(success[is_late_down] == 1, na.rm = TRUE),
    off_late_down_wpa = round(sum(wpa[is_late_down], na.rm = TRUE), 2)
  ) %>%
  left_join(three_and_outs, by = "week") %>%
  mutate(
    off_three_and_outs = ifelse(is.na(three_and_outs), 0, three_and_outs)
  ) %>%
  select(-three_and_outs) %>%
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
cat("Offensive Situational Statistics for:", team_abbr, "\n\n")
print(final_table)

# Optional: View in RStudio's data viewer
View(final_table)