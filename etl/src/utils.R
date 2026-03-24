# Utility Functions

library(logger)
library(dplyr)

setup_logging <- function(level = "INFO") {
  log_threshold(level)
  log_appender(appender_console)
  log_formatter(formatter_sprintf)
  cat(paste("Logging setup complete - Level:", level, "\n"))
}

enhance_player_data <- function(player_stats, player_data, schedule_data = NULL) {
  cat("Enhancing player data with team, position, and game result info...\n")

  player_lookup <- player_data %>%
    select(
      player_id = gsis_id,
      team_id = latest_team,
      position
    ) %>%
    filter(!is.na(player_id)) %>%
    filter(!is.na(position) | !is.na(team_id)) %>%
    distinct()

  enhanced_stats <- player_stats %>%
    left_join(
      player_lookup,
      by = "player_id",
      suffix = c("", "_lookup")
    ) %>%
    mutate(
      team_id = coalesce(team_id, team_id_lookup),
      position = coalesce(position, position_lookup)
    ) %>%
    select(-ends_with("_lookup")) %>%
    group_by(player_id, season) %>%
    fill(team_id, position, .direction = "downup") %>%
    ungroup()

  # Infer position from stats for remaining NULLs
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

  if (!is.null(schedule_data)) {
    game_results <- schedule_data %>%
      select(season, week, home_team, away_team, result) %>%
      filter(!is.na(result)) %>%
      {bind_rows(
        mutate(.,
          team_id = home_team,
          win = result > 0,
          loss = result < 0,
          tie = result == 0
        ),
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
      mutate(week = as.integer(week))

    if (!("win" %in% colnames(enhanced_stats))) {
      enhanced_stats$win <- FALSE
      enhanced_stats$loss <- FALSE
      enhanced_stats$tie <- FALSE
    }

    enhanced_stats <- enhanced_stats %>%
      left_join(
        game_results,
        by = c("team_id", "season", "week")
      ) %>%
      mutate(
        win = coalesce(win.y, win.x, FALSE),
        loss = coalesce(loss.y, loss.x, FALSE),
        tie = coalesce(tie.y, tie.x, FALSE)
      ) %>%
      select(-ends_with(".x"), -ends_with(".y"))
  }

  cat(paste("Enhanced", nrow(enhanced_stats), "player records\n"))
  return(enhanced_stats)
}

enhance_team_data <- function(team_stats, schedule_data) {
  cat("Enhancing team data with game results...\n")

  game_results <- schedule_data %>%
    select(season, week, home_team, away_team, result) %>%
    filter(!is.na(result)) %>%
    {bind_rows(
      mutate(.,
        team_id = home_team,
        win = result > 0,
        loss = result < 0,
        tie = result == 0
      ),
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
    mutate(week = as.integer(week))

  if (!("win" %in% colnames(team_stats))) {
    team_stats$win <- FALSE
    team_stats$loss <- FALSE
    team_stats$tie <- FALSE
  }

  enhanced_stats <- team_stats %>%
    left_join(
      game_results,
      by = c("team_id", "season", "week")
    ) %>%
    mutate(
      win = coalesce(win.y, win.x, FALSE),
      loss = coalesce(loss.y, loss.x, FALSE),
      tie = coalesce(tie.y, tie.x, FALSE)
    ) %>%
    select(-ends_with(".x"), -ends_with(".y"))

  cat(paste("Enhanced", nrow(enhanced_stats), "team records\n"))
  return(enhanced_stats)
}

validate_data <- function(data, data_type = "unknown") {
  cat(paste("Validating", data_type, "data...\n"))

  total_rows <- nrow(data)
  missing_key_fields <- sum(is.na(data$player_id) | is.na(data$team_id))

  cat(paste("- Total rows:", total_rows, "\n"))
  cat(paste("- Missing key fields:", missing_key_fields, "\n"))

  if (missing_key_fields > 0) {
    cat("Warning: Some records have missing key fields\n")
  } else {
    cat("Data validation passed\n")
  }

  return(missing_key_fields == 0)
}

create_progress_tracker <- function(total, description = "Processing") {
  start_time <- Sys.time()

  function(current) {
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

retry_operation <- function(operation, max_retries = 3, delay = 1) {
  for (attempt in 1:max_retries) {
    result <- tryCatch({
      operation()
    }, error = function(e) {
      cat(paste("Attempt", attempt, "failed:", e$message, "\n"))
      if (attempt < max_retries) {
        current_delay <- delay * (2 ^ (attempt - 1))
        cat(paste("Retrying in", current_delay, "seconds...\n"))
        Sys.sleep(current_delay)
      }
      return(NULL)
    })

    if (!is.null(result)) {
      if (attempt > 1) {
        cat(paste("Operation succeeded on attempt", attempt, "\n"))
      }
      return(result)
    }
  }

  cat(paste("Operation failed after", max_retries, "attempts\n"))
  return(NULL)
}
