# NFL ETL Pipeline
# Main orchestrator for extracting, transforming, and loading NFL statistics
# Processes play-by-play data from nflverse into a PostgreSQL database

library(dplyr)
library(logger)

# Load all required modules
source("config/database.R")
source("src/extract.R")
source("src/transform_players.R")
source("src/transform_teams.R")
source("src/load.R")
source("src/utils.R")

# Main ETL function that processes one or more NFL seasons
# @param seasons: Vector of years to process (e.g., c(2022, 2023, 2024))
# @param clear_existing: Whether to clear existing data before loading
# @return: TRUE if successful, FALSE if failed
run_etl_pipeline <- function(seasons, clear_existing = FALSE) {
  cat("=== NFL ETL Pipeline Starting ===\n")
  setup_logging("INFO")
  
  # Test database connectivity before starting
  if (!test_db_connection()) {
    cat("❌ Database connection failed. Please check your .env file.\n")
    return(FALSE)
  }
  
  # Setup progress tracking for multiple seasons
  total_seasons <- length(seasons)
  season_progress <- create_progress_tracker(total_seasons, "Processing seasons")
  
  # Process each season sequentially
  for (i in seq_along(seasons)) {
    season <- seasons[i]
    season_progress(i)
    
    cat(paste("\n--- Processing Season", season, "---\n"))
    
    if (clear_existing) {
      clear_season_data(season)
    }
    
    # PHASE 1: EXTRACT DATA FROM NFLVERSE
    cat("\n1. EXTRACTION PHASE\n")
    
    # Get play-by-play data for this season
    pbp_data <- retry_operation(function() {
      extract_pbp_data(season)
    })
    
    if (is.null(pbp_data)) {
      cat(paste("❌ Failed to extract PBP data for season", season, "\n"))
      next
    }
    
    # Get player roster data (only needed once since it contains all players)
    if (i == 1) {
      player_data <- retry_operation(function() {
        extract_player_data()
      })
      
      if (is.null(player_data)) {
        cat("❌ Failed to extract player data\n")
        next
      }
    }
    
    # Get schedule data for game results and week information
    schedule_data <- retry_operation(function() {
      extract_schedule_data(season)
    })
    
    # Get team data (only needed once)
    if (i == 1) {
      team_data <- retry_operation(function() {
        extract_team_data()
      })
      
      if (!is.null(team_data)) {
        load_team_data(team_data)
      }
    }
    
    # PHASE 2: TRANSFORM DATA INTO STATISTICS
    cat("\n2. TRANSFORMATION PHASE\n")
    
    # Calculate player statistics (passing, rushing, receiving)
    player_stats <- retry_operation(function() {
      transform_player_stats(pbp_data, season)
    })
    
    if (is.null(player_stats)) {
      cat(paste("❌ Failed to transform player stats for season", season, "\n"))
      next
    }
    
    # Calculate team statistics (offensive and defensive)
    team_stats <- retry_operation(function() {
      transform_team_stats(pbp_data, season)
    })
    
    if (is.null(team_stats)) {
      cat(paste("❌ Failed to transform team stats for season", season, "\n"))
      next
    }
    
    # Enhance statistics with additional metadata
    if (!is.null(player_data)) {
      player_stats <- enhance_player_data(player_stats, player_data, schedule_data)
    }
    
    if (!is.null(schedule_data)) {
      team_stats <- enhance_team_data(team_stats, schedule_data)
    }
    
    # PHASE 3: LOAD DATA INTO DATABASE
    cat("\n3. LOADING PHASE\n")
    
    # Load reference data (teams, players, weeks)
    if (!is.null(player_data)) {
      load_player_data(player_data, season)
    }
    
    if (!is.null(schedule_data)) {
      load_weeks_data(schedule_data)
    }
    
    # Load calculated statistics
    player_success <- retry_operation(function() {
      load_player_stats(player_stats)
    })
    
    team_success <- retry_operation(function() {
      load_team_stats(team_stats)
    })
    
    if (is.null(player_success) || is.null(team_success)) {
      cat(paste("❌ Failed to load stats for season", season, "\n"))
      next
    }
    
    cat(paste("✅ Season", season, "completed successfully\n"))
  }
  
  cat("\n=== ETL Pipeline Complete ===\n")
  return(TRUE)
}

# Command line execution support
# Allows running ETL from command line: Rscript etl_pipeline.R 2023 2024
if (!interactive()) {
  args <- commandArgs(trailingOnly = TRUE)
  
  if (length(args) == 0) {
    seasons <- c(2024)  # Default to current season
  } else {
    seasons <- as.integer(args)
  }
  
  run_etl_pipeline(seasons, clear_existing = TRUE)
}