# Lamar Jackson 2024 Passing Statistics Analysis
# Uses nflverse play-by-play data to calculate detailed passing stats

# Load required libraries
library(nflreadr)
library(dplyr)

# Load 2024 play-by-play data
pbp_2024 <- load_pbp(2024)

# Find Lamar Jackson's player ID
lamar_id <- pbp_2024 %>%
  filter(passer_player_name == "L.Jackson", !is.na(passer_player_id)) %>%
  pull(passer_player_id) %>%
  unique() %>%
  first()

# Filter for all Lamar's dropbacks (passes, sacks, spikes, scrambles)
lamar_all_dropbacks <- pbp_2024 %>%
  filter(
    season_type == "REG",
    (two_point_attempt != 1 | is.na(two_point_attempt)),
    play == 1,
    (
      (passer_player_id == lamar_id & (qb_dropback == 1 | qb_spike == 1)) |
      (qb_scramble == 1 & rusher_player_id == lamar_id)
    )
  ) %>%
  distinct(game_id, play_id, .keep_all = TRUE)

# Calculate weekly statistics
weekly_stats <- lamar_all_dropbacks %>%
  group_by(week) %>%
  summarise(
    # Dropback stats
    pass_qb_dropbacks = n(),
    pass_attempts = {
      current_week <- first(week)
      pbp_2024 %>%
        filter(season_type == "REG", week == current_week,
               (two_point_attempt != 1 | is.na(two_point_attempt)),
               passer_player_id == lamar_id, pass_attempt == 1,
               (is.na(sack) | sack == 0)) %>%
        nrow()
    },
    
    # Basic passing stats
    pass_completions = sum(complete_pass == 1 & pass_attempt == 1 & qb_scramble != 1 & sack != 1, na.rm = TRUE),
    pass_yards = sum(ifelse(pass_attempt == 1 & qb_scramble != 1 & sack != 1, passing_yards, 0), na.rm = TRUE),
    pass_touchdowns = sum(ifelse(pass_attempt == 1 & qb_scramble != 1 & sack != 1, pass_touchdown, 0), na.rm = TRUE),
    pass_ints = sum(ifelse(pass_attempt == 1 & qb_scramble != 1 & sack != 1, interception, 0), na.rm = TRUE),
    pass_long = ifelse(any(pass_attempt == 1 & qb_scramble != 1 & sack != 1 & !is.na(passing_yards)),
                       max(ifelse(pass_attempt == 1 & qb_scramble != 1 & sack != 1, passing_yards, 0), na.rm = TRUE), 0),
    
    # Pressure stats
    pass_sacks = sum(sack == 1, na.rm = TRUE),
    pass_sack_yards = abs(sum(ifelse(sack == 1, yards_gained, 0), na.rm = TRUE)),
    pass_qb_hits = sum(qb_hit == 1 & sack != 1, na.rm = TRUE),
    
    # Advanced passing metrics
    pass_air_yards = sum(ifelse(pass_attempt == 1 & qb_scramble != 1 & sack != 1, air_yards, 0), na.rm = TRUE),
    pass_yac_total = sum(ifelse(pass_attempt == 1 & qb_scramble != 1 & sack != 1,
                                ifelse(is.na(yards_after_catch), 0, yards_after_catch), 0), na.rm = TRUE),
    pass_first_downs = sum(ifelse(pass_attempt == 1 & qb_scramble != 1 & sack != 1, first_down_pass, 0), na.rm = TRUE),
    pass_20_plus = sum(ifelse(pass_attempt == 1 & qb_scramble != 1 & sack != 1 & !is.na(passing_yards),
                              ifelse(passing_yards >= 20, 1, 0), 0), na.rm = TRUE),
    
    # EPA/WPA/Success metrics
    pass_epa = round(sum(ifelse(qb_scramble != 1, epa, 0), na.rm = TRUE), 2),
    pass_wpa = round(sum(ifelse(qb_scramble != 1, wpa, 0), na.rm = TRUE), 2),
    pass_success_total = sum(ifelse(success == 1, 1, 0), na.rm = TRUE),
    pass_cpoe_total = round(sum(ifelse(pass_attempt == 1 & qb_scramble != 1 & sack != 1, cpoe, 0), na.rm = TRUE), 2),

    pass_yac_wpa_total = round(sum(ifelse(pass_attempt == 1 & qb_scramble != 1 & sack != 1, yac_wpa, 0), na.rm = TRUE), 2),
  ) %>%
  arrange(week) %>%
  mutate(week = as.character(week))

# Calculate season totals
season_totals <- weekly_stats %>%
  summarise(
    week = "Total",
    across(where(is.numeric), ~if(cur_column() == "pass_long") max(.) else sum(.))
  )

# Combine weekly stats with season totals
final_table <- bind_rows(weekly_stats, season_totals)

# Display the results
print(final_table)
