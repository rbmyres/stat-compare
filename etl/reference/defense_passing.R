# Team Defense Passing Statistics Analysis 2024
# Uses nflverse play-by-play data to calculate team pass defense stats

# Load required libraries
library(nflreadr)
library(dplyr)

# CHANGE THIS TO ANALYZE DIFFERENT TEAMS
team_abbr <- "BAL"  # Example: Baltimore Ravens

# Load 2024 play-by-play data
pbp_2024 <- load_pbp(2024)

# Filter for all defensive dropbacks (passes, sacks, spikes, scrambles)
team_defense_passing <- pbp_2024 %>%
  filter(
    defteam == team_abbr,
    season_type == "REG",
    (two_point_attempt != 1 | is.na(two_point_attempt)),
    play == 1,
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

# Calculate weekly statistics
weekly_stats <- team_defense_passing %>%
  group_by(week) %>%
  summarise(
    def_pass_dropbacks = n(),
    def_pass_attempts = {
      current_week <- first(week)
      pbp_2024 %>%
        filter(season_type == "REG", week == current_week,
               (two_point_attempt != 1 | is.na(two_point_attempt)),
               defteam == team_abbr, pass_attempt == 1,
               (is.na(sack) | sack == 0)) %>%
        nrow()
    },
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
    def_pass_epa = round(sum(ifelse(qb_scramble != 1, epa, 0), na.rm = TRUE), 2),
    def_pass_wpa = round(sum(ifelse(qb_scramble != 1, wpa, 0), na.rm = TRUE), 2),
    def_pass_success_total = sum(ifelse(qb_scramble != 1 & success == 1, 1, 0), na.rm = TRUE),
    def_pass_20_plus = sum(is_20_plus, na.rm = TRUE)
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
cat("Defensive Passing Statistics for:", team_abbr, "\n\n")
print(final_table)

# Optional: View in RStudio's data viewer
View(final_table)