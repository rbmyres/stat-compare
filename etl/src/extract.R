# Data Extraction - nflverse API

library(nflreadr)

extract_pbp_data <- function(seasons) {
  cat(paste("Extracting play-by-play data for seasons:", paste(seasons, collapse = ", "), "\n"))

  tryCatch({
    pbp_data <- nflreadr::load_pbp(seasons = seasons)
    cat(paste("Extracted", nrow(pbp_data), "plays for", length(seasons), "season(s)\n"))
    return(pbp_data)
  }, error = function(e) {
    cat(paste("Failed to extract PBP data:", e$message, "\n"))
    return(NULL)
  })
}

extract_player_data <- function() {
  cat("Extracting player information...\n")

  tryCatch({
    player_data <- nflreadr::load_players()
    cat(paste("Extracted player data for", nrow(player_data), "players\n"))
    return(player_data)
  }, error = function(e) {
    cat(paste("Failed to extract player data:", e$message, "\n"))
    return(NULL)
  })
}

extract_team_data <- function() {
  cat("Extracting team information...\n")

  tryCatch({
    team_data <- nflreadr::load_teams()
    cat(paste("Extracted data for", nrow(team_data), "teams\n"))
    return(team_data)
  }, error = function(e) {
    cat(paste("Failed to extract team data:", e$message, "\n"))
    return(NULL)
  })
}

extract_schedule_data <- function(seasons) {
  cat(paste("Extracting schedule data for seasons:", paste(seasons, collapse = ", "), "\n"))

  tryCatch({
    schedule_data <- nflreadr::load_schedules(seasons = seasons)
    cat(paste("Extracted schedule data for", nrow(schedule_data), "games\n"))
    return(schedule_data)
  }, error = function(e) {
    cat(paste("Failed to extract schedule data:", e$message, "\n"))
    return(NULL)
  })
}