# NFL ETL Pipeline

library(dplyr)
library(logger)

source("config/database.R")
source("src/extract.R")
source("src/transform_players.R")
source("src/transform_teams.R")
source("src/load.R")
source("src/utils.R")

run_etl_pipeline <- function(seasons, clear_existing = FALSE) {
  cat("=== NFL ETL Pipeline Starting ===\n")
  setup_logging("INFO")

  if (!test_db_connection()) {
    cat("Database connection failed. Please check your .env file.\n")
    return(FALSE)
  }

  total_seasons <- length(seasons)
  season_progress <- create_progress_tracker(total_seasons, "Processing seasons")

  for (i in seq_along(seasons)) {
    season <- seasons[i]
    season_progress(i)

    cat(paste("\n--- Processing Season", season, "---\n"))

    if (clear_existing) {
      clear_season_data(season)
    }

    # Extract
    cat("\n1. EXTRACTION PHASE\n")

    pbp_data <- retry_operation(function() {
      extract_pbp_data(season)
    })

    if (is.null(pbp_data)) {
      cat(paste("Failed to extract PBP data for season", season, "\n"))
      next
    }

    if (i == 1) {
      player_data <- retry_operation(function() {
        extract_player_data()
      })

      if (is.null(player_data)) {
        cat("Failed to extract player data\n")
        next
      }
    }

    schedule_data <- retry_operation(function() {
      extract_schedule_data(season)
    })

    if (i == 1) {
      team_data <- retry_operation(function() {
        extract_team_data()
      })

      if (!is.null(team_data)) {
        load_team_data(team_data)
      }
    }

    # Transform
    cat("\n2. TRANSFORMATION PHASE\n")

    player_stats <- retry_operation(function() {
      transform_player_stats(pbp_data, season)
    })

    if (is.null(player_stats)) {
      cat(paste("Failed to transform player stats for season", season, "\n"))
      next
    }

    team_stats <- retry_operation(function() {
      transform_team_stats(pbp_data, season)
    })

    if (is.null(team_stats)) {
      cat(paste("Failed to transform team stats for season", season, "\n"))
      next
    }

    if (!is.null(player_data)) {
      player_stats <- enhance_player_data(player_stats, player_data, schedule_data)
      # Filter to skill positions (QB/WR/RB/TE)
      before_count <- nrow(player_stats)
      player_stats <- player_stats %>% filter(position %in% c("QB", "WR", "RB", "TE"))
      cat(paste("  - Filtered to skill positions:", before_count, "->", nrow(player_stats), "rows\n"))
    }

    if (!is.null(schedule_data)) {
      team_stats <- enhance_team_data(team_stats, schedule_data)
    }

    # Load
    cat("\n3. LOADING PHASE\n")

    if (!is.null(player_data)) {
      load_player_data(player_data, season)
    }

    if (!is.null(schedule_data)) {
      load_weeks_data(schedule_data)
    }

    player_success <- retry_operation(function() {
      load_player_stats(player_stats, player_data, pbp_data)
    })

    team_success <- retry_operation(function() {
      load_team_stats(team_stats)
    })

    if (is.null(player_success) || is.null(team_success)) {
      cat(paste("Failed to load stats for season", season, "\n"))
      next
    }

    cat(paste("Season", season, "completed successfully\n"))
  }

  cat("\n=== ETL Pipeline Complete ===\n")
  return(TRUE)
}

if (!interactive()) {
  args <- commandArgs(trailingOnly = TRUE)

  if (length(args) == 0) {
    seasons <- c(2024)
  } else {
    seasons <- as.integer(args)
  }

  run_etl_pipeline(seasons, clear_existing = TRUE)
}