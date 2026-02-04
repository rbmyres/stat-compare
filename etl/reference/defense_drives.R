# Team Defense ETL Statistics Analysis 2024
# Uses nflverse play-by-play data to calculate complex defensive metrics
# Basic stats (plays, yards, etc.) are handled by DB generated columns

# Load required libraries
library(nflreadr)
library(dplyr)

# CHANGE THIS TO ANALYZE DIFFERENT TEAMS
team_abbr <- "BAL"  # Example: Baltimore Ravens

# Load 2024 play-by-play data
pbp_2024 <- load_pbp(2024)

# Filter for team's defensive plays
team_defense <- pbp_2024 %>%
  filter(
    defteam == team_abbr,
    season_type == "REG",
    play == 1,
    (two_point_attempt != 1 | is.na(two_point_attempt))
  ) %>%
  distinct(game_id, play_id, .keep_all = TRUE)

# Get all team scoring against defense for points calculation
scoring_plays <- pbp_2024 %>%
  filter(
    season_type == "REG",
    (!is.na(posteam_score_post) & !is.na(posteam_score) & posteam_score_post > posteam_score & defteam == team_abbr) |
    (!is.na(defteam_score_post) & !is.na(defteam_score) & defteam_score_post > defteam_score & posteam == team_abbr)
  ) %>%
  mutate(
    points_allowed = case_when(
      defteam == team_abbr & posteam_score_post > posteam_score ~ posteam_score_post - posteam_score,
      posteam == team_abbr & defteam_score_post > defteam_score ~ defteam_score_post - defteam_score,
      TRUE ~ 0
    )
  ) %>%
  filter(points_allowed > 0)

# Get drive-level data (only drives with at least one play)
drive_stats <- pbp_2024 %>%
  filter(
    defteam == team_abbr,
    season_type == "REG",
    !is.na(drive),
    !is.na(game_id),
    play == 1
  ) %>%
  group_by(week) %>%
  summarise(
    def_drives_total = n_distinct(paste(game_id, drive))
  )

# Calculate weekly ETL statistics (complex calculations only)
weekly_stats <- team_defense %>%
  group_by(week) %>%
  summarise(
    def_fumbles = sum(fumble, na.rm = TRUE) - sum(fumble_lost, na.rm = TRUE),
    def_fumbles_lost = sum(fumble_lost, na.rm = TRUE),
    def_turnovers = sum(interception, na.rm = TRUE) + sum(fumble_lost, na.rm = TRUE)
  ) %>%
  left_join(drive_stats, by = "week") %>%
  left_join(
    scoring_plays %>%
      group_by(week) %>%
      summarise(
        def_points_total = sum(points_allowed, na.rm = TRUE)
      ), by = "week"
  ) %>%
  mutate(
    def_drives_total = ifelse(is.na(def_drives_total), 0, def_drives_total),
    def_points_total = ifelse(is.na(def_points_total), 0, def_points_total)
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
cat("Defensive ETL Statistics for:", team_abbr, "\n\n")
print(final_table)

# Optional: View in RStudio's data viewer
View(final_table)

# Optional: Save to CSV for future reference
write.csv(final_table, paste0(team_abbr, "_2024_defense_drives_stats.csv"), row.names = FALSE)
