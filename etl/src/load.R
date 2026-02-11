# Database Loading Functions
# Handles inserting transformed data into PostgreSQL/Supabase database
# All functions include error handling and graceful failure recovery

library(RPostgres)
library(DBI)
library(dplyr)
library(logger)

source("config/database.R")

# Load player reference data into the players table
# Inserts basic player information (names, IDs, season ranges) for lookup purposes
# @param player_data: DataFrame with player information from nflreadr
# @param season: Current season being processed (used for season range calculation)
# @return: TRUE if successful, FALSE if failed
load_player_data <- function(player_data, season = NULL) {
  cat("Loading player data...\n")
  
  con <- get_db_connection()
  if (is.null(con)) return(FALSE)
  
  tryCatch({
    # Format player data for database insertion
    players_formatted <- player_data %>%
      select(
        player_id = gsis_id,
        first_name = common_first_name,
        last_name,
        position,
        rookie_season,
        last_season
      ) %>%
      filter(
        !is.na(player_id),
        position %in% c("QB", "WR", "RB", "TE")
      ) %>%
      select(-position) %>%
      distinct()
    
    # Use actual season range from nflreadr roster data
    players_formatted <- players_formatted %>%
      mutate(
        first_season = coalesce(as.integer(rookie_season), as.integer(season)),
        last_season = coalesce(as.integer(last_season), as.integer(season))
      ) %>%
      # Remove the helper columns
      select(-any_of(c("rookie_season")))
    
    # Insert players (ignore duplicates from previous runs)
    if (nrow(players_formatted) > 0) {
      tryCatch({
        dbWriteTable(con, "players", players_formatted, 
                     append = TRUE, row.names = FALSE, overwrite = FALSE)
        cat(paste("✓ Loaded", nrow(players_formatted), "player records\n"))
      }, error = function(e) {
        cat("✓ Players table already populated (skipping)\n")
      })
    }
    
    close_db_connection(con)
    return(TRUE)
    
  }, error = function(e) {
    cat(paste("❌ Failed to load player data:", e$message, "\n"))
    close_db_connection(con)
    return(FALSE)
  })
}

# Load team reference data into the teams table
# Inserts team information (names, colors, abbreviations) for lookup purposes
# @param team_data: DataFrame with team information from nflreadr
# @return: TRUE if successful, FALSE if failed
load_team_data <- function(team_data) {
  cat("Loading team data...\n")
  
  con <- get_db_connection()
  if (is.null(con)) return(FALSE)
  
  tryCatch({
    # Format team data for database insertion
    teams_formatted <- team_data %>%
      select(
        team_id = team_abbr,
        abbr = team_abbr,
        display_name = team_name,
        nickname = team_nick,
        primary_color = team_color
      ) %>%
      filter(!is.na(team_id)) %>%
      distinct()
    
    # Insert teams (ignore duplicates from previous runs)
    if (nrow(teams_formatted) > 0) {
      tryCatch({
        dbWriteTable(con, "teams", teams_formatted, 
                     append = TRUE, row.names = FALSE, overwrite = FALSE)
        cat(paste("✓ Loaded", nrow(teams_formatted), "team records\n"))
      }, error = function(e) {
        cat("✓ Teams table already populated (skipping)\n")
      })
    }
    
    close_db_connection(con)
    return(TRUE)
    
  }, error = function(e) {
    cat(paste("❌ Failed to load team data:", e$message, "\n"))
    close_db_connection(con)
    return(FALSE)
  })
}

# Load weeks reference data from schedule information
# Creates week records for regular season and playoffs to support foreign key relationships
# @param schedule_data: DataFrame with schedule information from nflreadr
# @return: TRUE if successful, FALSE if failed
load_weeks_data <- function(schedule_data) {
  cat("Loading weeks data from schedule...\n")
  
  con <- get_db_connection()
  if (is.null(con)) return(FALSE)
  
  tryCatch({
    # Extract unique week information from schedule
    weeks_data <- schedule_data %>%
      select(season, week, game_type) %>%
      filter(!is.na(season), !is.na(week)) %>%
      mutate(
        season_type = case_when(
          game_type == "REG" ~ "REG",
          game_type == "POST" ~ "POST", 
          game_type == "WC" ~ "POST",
          game_type == "DIV" ~ "POST",
          game_type == "CON" ~ "POST",
          game_type == "SB" ~ "POST",
          TRUE ~ "REG"
        )
      ) %>%
      select(season, week, season_type) %>%
      distinct()
    
    # Insert weeks (ignore duplicates from previous runs)
    if (nrow(weeks_data) > 0) {
      tryCatch({
        dbWriteTable(con, "weeks", weeks_data, 
                     append = TRUE, row.names = FALSE, overwrite = FALSE)
        cat(paste("✓ Loaded", nrow(weeks_data), "week records\n"))
      }, error = function(e) {
        cat("✓ Weeks table already populated (skipping)\n")
      })
    }
    
    close_db_connection(con)
    return(TRUE)
    
  }, error = function(e) {
    cat(paste("❌ Failed to load weeks data:", e$message, "\n"))
    close_db_connection(con)
    return(FALSE)
  })
}

# Ensure all players from player_stats exist in the players table
# Inserts missing players with minimal info to satisfy foreign key constraints
# @param player_stats: DataFrame with player statistics containing player_id column
# @return: TRUE if successful, FALSE if failed
ensure_players_exist <- function(player_stats) {
  con <- get_db_connection()
  if (is.null(con)) return(FALSE)

  tryCatch({
    # Get unique player_ids from stats
    stats_player_ids <- unique(player_stats$player_id)

    # Get existing player_ids from database
    existing_players <- dbGetQuery(con, "SELECT player_id FROM players")$player_id

    # Find missing players
    missing_ids <- setdiff(stats_player_ids, existing_players)

    if (length(missing_ids) > 0) {
      cat(paste("Inserting", length(missing_ids), "missing players...\n"))

      # Create minimal player records for missing players
      missing_players <- data.frame(
        player_id = missing_ids,
        first_name = "Unknown",
        last_name = "Player",
        first_season = as.integer(format(Sys.Date(), "%Y")),
        last_season = as.integer(format(Sys.Date(), "%Y")),
        stringsAsFactors = FALSE
      )

      dbWriteTable(con, "players", missing_players,
                   append = TRUE, row.names = FALSE, overwrite = FALSE)
      cat(paste("✓ Inserted", length(missing_ids), "missing player records\n"))
    }

    close_db_connection(con)
    return(TRUE)

  }, error = function(e) {
    cat(paste("❌ Failed to ensure players exist:", e$message, "\n"))
    close_db_connection(con)
    return(FALSE)
  })
}

# Load player statistics into the player_week table
# Inserts weekly player performance data (passing, rushing, receiving stats)
# @param player_stats: DataFrame with player statistics from transform_player_stats
# @return: TRUE if successful, FALSE if failed
load_player_stats <- function(player_stats) {
  cat(paste("Loading", nrow(player_stats), "player-week records...\n"))

  # First ensure all players exist in the players table
  ensure_players_exist(player_stats)

  con <- get_db_connection()
  if (is.null(con)) return(FALSE)

  tryCatch({
    # Insert player statistics into player_week table
    dbWriteTable(con, "player_week", player_stats,
                 append = TRUE, row.names = FALSE, overwrite = FALSE)
    cat(paste("✓ Loaded", nrow(player_stats), "player-week records\n"))

    close_db_connection(con)
    return(TRUE)

  }, error = function(e) {
    cat(paste("❌ Failed to load player stats:", e$message, "\n"))
    close_db_connection(con)
    return(FALSE)
  })
}

# Load team statistics into the team_week table
# Inserts weekly team performance data (offensive and defensive stats)
# @param team_stats: DataFrame with team statistics from transform_team_stats
# @return: TRUE if successful, FALSE if failed
load_team_stats <- function(team_stats) {
  cat(paste("Loading", nrow(team_stats), "team-week records...\n"))
  
  con <- get_db_connection()
  if (is.null(con)) return(FALSE)
  
  tryCatch({
    # Insert team statistics into team_week table
    dbWriteTable(con, "team_week", team_stats, 
                 append = TRUE, row.names = FALSE, overwrite = FALSE)
    cat(paste("✓ Loaded", nrow(team_stats), "team-week records\n"))
    
    close_db_connection(con)
    return(TRUE)
    
  }, error = function(e) {
    cat(paste("❌ Failed to load team stats:", e$message, "\n"))
    close_db_connection(con)
    return(FALSE)
  })
}

# Clear all data for a specific season
# Removes existing statistics and reference data to enable clean re-runs
# @param season: Integer year to clear (e.g., 2024)
# @return: TRUE if successful, FALSE if failed
clear_season_data <- function(season) {
  cat(paste("Clearing existing data for season", season, "...\n"))
  
  con <- get_db_connection()
  if (is.null(con)) return(FALSE)
  
  tryCatch({
    # Remove statistics data (order matters due to foreign keys)
    dbExecute(con, "DELETE FROM player_week WHERE season = $1", params = list(season))
    dbExecute(con, "DELETE FROM team_week WHERE season = $1", params = list(season))
    
    # Remove week reference data for this season
    dbExecute(con, "DELETE FROM weeks WHERE season = $1", params = list(season))
    
    cat(paste("✓ Cleared existing data for season", season, "\n"))
    
    close_db_connection(con)
    return(TRUE)
    
  }, error = function(e) {
    cat(paste("❌ Failed to clear season data:", e$message, "\n"))
    close_db_connection(con)
    return(FALSE)
  })
}