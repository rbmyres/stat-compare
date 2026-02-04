# Data Extraction Functions
# Handles downloading data from nflverse API using the nflreadr package
# All functions include error handling and return NULL on failure

library(nflreadr)

# Extract play-by-play data for specified seasons
# This is the core dataset containing all plays, statistics, and game information
# @param seasons: Vector of years to extract (e.g., c(2023, 2024))
# @return: DataFrame with play-by-play data, or NULL on error
extract_pbp_data <- function(seasons) {
  cat(paste("Extracting play-by-play data for seasons:", paste(seasons, collapse = ", "), "\n"))
  
  tryCatch({
    pbp_data <- nflreadr::load_pbp(seasons = seasons)
    
    cat(paste("✓ Extracted", nrow(pbp_data), "plays for", length(seasons), "season(s)\n"))
    return(pbp_data)
    
  }, error = function(e) {
    cat(paste("❌ Failed to extract PBP data:", e$message, "\n"))
    return(NULL)
  })
}

# Extract player roster and metadata
# Contains player names, positions, and team information
# @return: DataFrame with player information, or NULL on error
extract_player_data <- function() {
  cat("Extracting player information...\n")
  
  tryCatch({
    player_data <- nflreadr::load_players()
    
    cat(paste("✓ Extracted player data for", nrow(player_data), "players\n"))
    return(player_data)
    
  }, error = function(e) {
    cat(paste("❌ Failed to extract player data:", e$message, "\n"))
    return(NULL)
  })
}

# Extract team information and metadata
# Contains team names, divisions, colors, and other team details
# @return: DataFrame with team information, or NULL on error
extract_team_data <- function() {
  cat("Extracting team information...\n")
  
  tryCatch({
    team_data <- nflreadr::load_teams()
    
    cat(paste("✓ Extracted data for", nrow(team_data), "teams\n"))
    return(team_data)
    
  }, error = function(e) {
    cat(paste("❌ Failed to extract team data:", e$message, "\n"))
    return(NULL)
  })
}

# Extract schedule and game results for specified seasons
# Contains game dates, scores, and results needed for team record calculation
# @param seasons: Vector of years to extract (e.g., c(2023, 2024))
# @return: DataFrame with schedule data, or NULL on error
extract_schedule_data <- function(seasons) {
  cat(paste("Extracting schedule data for seasons:", paste(seasons, collapse = ", "), "\n"))
  
  tryCatch({
    schedule_data <- nflreadr::load_schedules(seasons = seasons)
    
    cat(paste("✓ Extracted schedule data for", nrow(schedule_data), "games\n"))
    return(schedule_data)
    
  }, error = function(e) {
    cat(paste("❌ Failed to extract schedule data:", e$message, "\n"))
    return(NULL)
  })
}