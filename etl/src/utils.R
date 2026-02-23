# Utility Functions
# Helper functions for data enhancement, validation, progress tracking, and error handling

library(logger)
library(dplyr)

# Configure logging system for the ETL pipeline
# @param level: Logging level ("DEBUG", "INFO", "WARN", "ERROR")
setup_logging <- function(level = "INFO") {
  log_threshold(level)
  log_appender(appender_console)
  log_formatter(formatter_sprintf)
  
  cat(paste("✓ Logging setup complete - Level:", level, "\n"))
}

# Enhance player statistics with team, position, and win/loss metadata
# Joins player stats with roster data and schedule data to add missing information
# @param player_stats: DataFrame with player statistics from transform_player_stats
# @param player_data: DataFrame with player roster information from nflreadr
# @param schedule_data: DataFrame with game schedule and results (optional)
# @return: Enhanced player stats with team_id, position, and win/loss filled in
enhance_player_data <- function(player_stats, player_data, schedule_data = NULL) {
  cat("Enhancing player data with team, position, and game result info...\n")
  
  # Create player lookup table from roster data
  player_lookup <- player_data %>%
    select(
      player_id = gsis_id,
      team_id = latest_team,
      position
    ) %>%
    filter(!is.na(player_id)) %>%
    filter(!is.na(position) | !is.na(team_id)) %>%
    distinct()
  
  # Join roster data with player statistics
  enhanced_stats <- player_stats %>%
    left_join(
      player_lookup,
      by = "player_id",
      suffix = c("", "_lookup")
    ) %>%
    # Use roster data to fill missing values
    mutate(
      team_id = coalesce(team_id, team_id_lookup),
      position = coalesce(position, position_lookup)
    ) %>%
    select(-ends_with("_lookup")) %>%
    # Forward/backward fill within player-season to handle mid-season changes
    group_by(player_id, season) %>%
    fill(team_id, position, .direction = "downup") %>%
    ungroup()
  
  # Infer position from stats for any remaining NULLs
  na_position_count <- sum(is.na(enhanced_stats$position))
  if (na_position_count > 0) {
    cat(paste("  - Inferring position for", na_position_count,
              "records with missing position...\n"))
    enhanced_stats <- enhanced_stats %>%
      mutate(
        position = case_when(
          !is.na(position) ~ position,
          pass_qb_dropbacks > 0 ~ "QB",
          rec_targets > 0 ~ "WR",
          rush_attempts > 0 ~ "RB",
          TRUE ~ "UNK"
        )
      )
  }

  # Add win/loss data if schedule is provided
  if (!is.null(schedule_data)) {
    # Create binary win/loss lookup table from schedule (same logic as team enhancement)
    game_results <- schedule_data %>%
      select(season, week, home_team, away_team, result) %>%
      filter(!is.na(result)) %>%
      # Create separate rows for home and away teams with their results
      {bind_rows(
        # Home team results
        mutate(., 
          team_id = home_team,
          win = result > 0,
          loss = result < 0,
          tie = result == 0
        ),
        # Away team results (opposite)
        mutate(., 
          team_id = away_team,
          win = result < 0,
          loss = result > 0,
          tie = result == 0
        )
      )} %>%
      select(season, week, team_id, win, loss, tie) %>%
      filter(!is.na(team_id)) %>%
      distinct() %>%
      mutate(week = as.integer(week))  # Match player_stats week format (integer)
    
    # Ensure enhanced_stats has the binary columns (in case they're missing)
    if (!("win" %in% colnames(enhanced_stats))) {
      enhanced_stats$win <- FALSE
      enhanced_stats$loss <- FALSE
      enhanced_stats$tie <- FALSE
    }
    
    # Join game results with enhanced player statistics
    enhanced_stats <- enhanced_stats %>%
      left_join(
        game_results,
        by = c("team_id", "season", "week")
      ) %>%
      # Handle column conflicts and fill missing values
      mutate(
        win = coalesce(win.y, win.x, FALSE),
        loss = coalesce(loss.y, loss.x, FALSE),
        tie = coalesce(tie.y, tie.x, FALSE)
      ) %>%
      select(-ends_with(".x"), -ends_with(".y"))
  }
  
  cat(paste("✓ Enhanced", nrow(enhanced_stats), "player records\n"))
  return(enhanced_stats)
}

# Enhance team statistics with binary win/loss/tie columns
# Joins team stats with schedule data to add binary game outcome information for each week
# @param team_stats: DataFrame with team statistics from transform_team_stats
# @param schedule_data: DataFrame with game schedule and results from nflreadr
# @return: Enhanced team stats with binary win, loss, tie columns added
enhance_team_data <- function(team_stats, schedule_data) {
  cat("Enhancing team data with binary game results...\n")
  
  # Process schedule data to create binary win/loss lookup table
  game_results <- schedule_data %>%
    select(season, week, home_team, away_team, result) %>%
    filter(!is.na(result)) %>%
    # Create separate rows for home and away teams with their results
    {bind_rows(
      # Home team results
      mutate(., 
        team_id = home_team,
        win = result > 0,
        loss = result < 0,
        tie = result == 0
      ),
      # Away team results (opposite)
      mutate(., 
        team_id = away_team,
        win = result < 0,
        loss = result > 0,
        tie = result == 0
      )
    )} %>%
    select(season, week, team_id, win, loss, tie) %>%
    filter(!is.na(team_id)) %>%
    distinct() %>%
    mutate(week = as.integer(week))  # Match team_stats week format (integer)
  
  # Ensure team_stats has the binary columns (in case they're missing)
  if (!("win" %in% colnames(team_stats))) {
    team_stats$win <- FALSE
    team_stats$loss <- FALSE
    team_stats$tie <- FALSE
  }
  
  # Join game results with team statistics
  enhanced_stats <- team_stats %>%
    left_join(
      game_results,
      by = c("team_id", "season", "week")
    ) %>%
    # Handle column conflicts and fill missing values
    mutate(
      win = coalesce(win.y, win.x, FALSE),
      loss = coalesce(loss.y, loss.x, FALSE),
      tie = coalesce(tie.y, tie.x, FALSE)
    ) %>%
    select(-ends_with(".x"), -ends_with(".y"))
  
  cat(paste("✓ Enhanced", nrow(enhanced_stats), "team records\n"))
  return(enhanced_stats)
}

# Validate data quality and completeness
# Checks for missing key fields and data integrity issues
# @param data: DataFrame to validate
# @param data_type: Description of data type for logging purposes
# @return: TRUE if validation passes, FALSE if issues found
validate_data <- function(data, data_type = "unknown") {
  cat(paste("Validating", data_type, "data...\n"))
  
  # Check for missing key identifier fields
  total_rows <- nrow(data)
  missing_key_fields <- sum(is.na(data$player_id) | is.na(data$team_id))
  
  cat(paste("- Total rows:", total_rows, "\n"))
  cat(paste("- Missing key fields:", missing_key_fields, "\n"))
  
  if (missing_key_fields > 0) {
    cat("⚠️  Warning: Some records have missing key fields\n")
  } else {
    cat("✓ Data validation passed\n")
  }
  
  return(missing_key_fields == 0)
}

# Create a progress tracker for long-running operations
# Returns a function that can be called with current progress to display status
# @param total: Total number of items to process
# @param description: Description of the operation being tracked
# @return: Function that accepts current progress and displays status
create_progress_tracker <- function(total, description = "Processing") {
  start_time <- Sys.time()
  
  function(current) {
    # Update progress every 5% or on completion
    if (current %% max(1, floor(total / 20)) == 0 || current == total) {
      elapsed <- as.numeric(Sys.time() - start_time, units = "secs")
      percent <- round(current / total * 100, 1)
      rate <- current / elapsed
      eta <- (total - current) / rate
      
      cat(sprintf("\r%s: %d/%d (%s%%) - %.1f/sec - ETA: %.1fs", 
                  description, current, total, percent, rate, eta))
      
      if (current == total) {
        cat(sprintf(" - Complete in %.1fs\n", elapsed))
      }
    }
  }
}

# Retry mechanism for operations that might fail due to network issues
# Automatically retries failed operations with exponential backoff
# @param operation: Function to execute (should be wrapped in a function)
# @param max_retries: Maximum number of retry attempts
# @param delay: Initial delay between retries in seconds
# @return: Result of successful operation, or NULL if all attempts fail
retry_operation <- function(operation, max_retries = 3, delay = 1) {
  for (attempt in 1:max_retries) {
    result <- tryCatch({
      operation()
    }, error = function(e) {
      cat(paste("❌ Attempt", attempt, "failed:", e$message, "\n"))
      if (attempt < max_retries) {
        current_delay <- delay * (2 ^ (attempt - 1))
        cat(paste("⏳ Retrying in", current_delay, "seconds...\n"))
        Sys.sleep(current_delay)
      }
      return(NULL)
    })
    
    if (!is.null(result)) {
      if (attempt > 1) {
        cat(paste("✓ Operation succeeded on attempt", attempt, "\n"))
      }
      return(result)
    }
  }
  
  cat(paste("❌ Operation failed after", max_retries, "attempts\n"))
  return(NULL)
}