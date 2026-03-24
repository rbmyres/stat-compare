# Database Loading Functions

library(RPostgres)
library(DBI)
library(dplyr)
library(logger)

source("config/database.R")

load_player_data <- function(player_data, season = NULL) {
  cat("Loading player data...\n")

  con <- get_db_connection()
  if (is.null(con)) return(FALSE)

  tryCatch({
    players_formatted <- player_data %>%
      select(
        player_id = gsis_id,
        first_name = common_first_name,
        last_name,
        position,
        rookie_season,
        last_season,
        headshot_url = headshot
      ) %>%
      filter(
        !is.na(player_id),
        position %in% c("QB", "WR", "RB", "TE")
      ) %>%
      select(-position) %>%
      distinct()

    players_formatted <- players_formatted %>%
      mutate(
        first_season = coalesce(as.integer(rookie_season), as.integer(season)),
        last_season = coalesce(as.integer(last_season), as.integer(season))
      ) %>%
      select(-any_of(c("rookie_season")))

    if (nrow(players_formatted) > 0) {
      tryCatch({
        dbWriteTable(con, "players", players_formatted,
                     append = TRUE, row.names = FALSE, overwrite = FALSE)
        cat(paste("Loaded", nrow(players_formatted), "player records\n"))
      }, error = function(e) {
        cat("Players table already populated (skipping)\n")
      })
    }

    close_db_connection(con)
    return(TRUE)

  }, error = function(e) {
    cat(paste("Failed to load player data:", e$message, "\n"))
    close_db_connection(con)
    return(FALSE)
  })
}

load_team_data <- function(team_data) {
  cat("Loading team data...\n")

  con <- get_db_connection()
  if (is.null(con)) return(FALSE)

  tryCatch({
    teams_formatted <- team_data %>%
      select(
        team_id = team_abbr,
        abbr = team_abbr,
        display_name = team_name,
        nickname = team_nick,
        primary_color = team_color,
        logo_url = team_logo_espn
      ) %>%
      filter(!is.na(team_id)) %>%
      distinct()

    if (nrow(teams_formatted) > 0) {
      tryCatch({
        dbWriteTable(con, "teams", teams_formatted,
                     append = TRUE, row.names = FALSE, overwrite = FALSE)
        cat(paste("Loaded", nrow(teams_formatted), "team records\n"))
      }, error = function(e) {
        cat("Teams table already populated (skipping)\n")
      })
    }

    close_db_connection(con)
    return(TRUE)

  }, error = function(e) {
    cat(paste("Failed to load team data:", e$message, "\n"))
    close_db_connection(con)
    return(FALSE)
  })
}

load_weeks_data <- function(schedule_data) {
  cat("Loading weeks data from schedule...\n")

  con <- get_db_connection()
  if (is.null(con)) return(FALSE)

  tryCatch({
    weeks_data <- schedule_data %>%
      select(season, week, game_type) %>%
      filter(!is.na(season), !is.na(week)) %>%
      mutate(
        season_type = case_when(
          game_type == "REG" ~ "REG",
          game_type %in% c("POST", "WC", "DIV", "CON", "SB") ~ "POST",
          TRUE ~ "REG"
        )
      ) %>%
      select(season, week, season_type) %>%
      distinct()

    if (nrow(weeks_data) > 0) {
      tryCatch({
        dbWriteTable(con, "weeks", weeks_data,
                     append = TRUE, row.names = FALSE, overwrite = FALSE)
        cat(paste("Loaded", nrow(weeks_data), "week records\n"))
      }, error = function(e) {
        cat("Weeks table already populated (skipping)\n")
      })
    }

    close_db_connection(con)
    return(TRUE)

  }, error = function(e) {
    cat(paste("Failed to load weeks data:", e$message, "\n"))
    close_db_connection(con)
    return(FALSE)
  })
}

# Inserts missing players from PBP data to satisfy FK constraints
ensure_players_exist <- function(player_stats, player_data = NULL, pbp_data = NULL) {
  con <- get_db_connection()
  if (is.null(con)) return(FALSE)

  tryCatch({
    stats_player_ids <- unique(player_stats$player_id)
    existing_players <- dbGetQuery(con, "SELECT player_id FROM players")$player_id
    missing_ids <- setdiff(stats_player_ids, existing_players)

    if (length(missing_ids) > 0) {
      cat(paste("Inserting", length(missing_ids), "missing players...\n"))

      # Try nflverse roster first
      if (!is.null(player_data)) {
        roster_lookup <- player_data %>%
          select(
            player_id = gsis_id,
            first_name = common_first_name,
            last_name,
            rookie_season,
            last_season
          ) %>%
          filter(player_id %in% missing_ids) %>%
          distinct(player_id, .keep_all = TRUE) %>%
          mutate(
            first_season = coalesce(as.integer(rookie_season), as.integer(format(Sys.Date(), "%Y"))),
            last_season = coalesce(as.integer(last_season), as.integer(format(Sys.Date(), "%Y")))
          ) %>%
          select(player_id, first_name, last_name, first_season, last_season)

        resolved_ids <- roster_lookup$player_id
        still_missing_ids <- setdiff(missing_ids, resolved_ids)
        cat(paste("  - Resolved", length(resolved_ids), "from nflverse roster\n"))
      } else {
        roster_lookup <- data.frame(
          player_id = character(0), first_name = character(0),
          last_name = character(0), first_season = integer(0),
          last_season = integer(0), stringsAsFactors = FALSE
        )
        still_missing_ids <- missing_ids
      }

      # Fallback: resolve from PBP names
      if (length(still_missing_ids) > 0 && !is.null(pbp_data)) {
        pbp_names <- bind_rows(
          pbp_data %>% select(player_id = passer_player_id, player_name = passer_player_name),
          pbp_data %>% select(player_id = rusher_player_id, player_name = rusher_player_name),
          pbp_data %>% select(player_id = receiver_player_id, player_name = receiver_player_name)
        ) %>%
          filter(!is.na(player_id), !is.na(player_name), player_id %in% still_missing_ids) %>%
          distinct(player_id, .keep_all = TRUE) %>%
          mutate(
            # PBP names are typically "F.Last"
            first_name = sub("^([^. ]+).*", "\\1", player_name),
            last_name = sub("^[^. ]+[. ]", "", player_name),
            first_season = as.integer(format(Sys.Date(), "%Y")),
            last_season = as.integer(format(Sys.Date(), "%Y"))
          ) %>%
          select(player_id, first_name, last_name, first_season, last_season)

        pbp_resolved_ids <- pbp_names$player_id
        still_missing_ids <- setdiff(still_missing_ids, pbp_resolved_ids)
        cat(paste("  - Resolved", length(pbp_resolved_ids), "from play-by-play data\n"))
        roster_lookup <- bind_rows(roster_lookup, pbp_names)
      }

      # Fix NA names using PBP data
      if (!is.null(pbp_data)) {
        na_name_ids <- roster_lookup %>%
          filter(is.na(first_name) | is.na(last_name)) %>%
          pull(player_id)

        if (length(na_name_ids) > 0) {
          pbp_fix <- bind_rows(
            pbp_data %>% select(player_id = passer_player_id, player_name = passer_player_name),
            pbp_data %>% select(player_id = rusher_player_id, player_name = rusher_player_name),
            pbp_data %>% select(player_id = receiver_player_id, player_name = receiver_player_name)
          ) %>%
            filter(!is.na(player_id), !is.na(player_name), player_id %in% na_name_ids) %>%
            distinct(player_id, .keep_all = TRUE) %>%
            mutate(
              pbp_first = sub("^([^. ]+).*", "\\1", player_name),
              pbp_last = sub("^[^. ]+[. ]", "", player_name)
            ) %>%
            select(player_id, pbp_first, pbp_last)

          roster_lookup <- roster_lookup %>%
            left_join(pbp_fix, by = "player_id") %>%
            mutate(
              first_name = coalesce(first_name, pbp_first),
              last_name = coalesce(last_name, pbp_last)
            ) %>%
            select(-pbp_first, -pbp_last)
        }
      }

      # Last resort placeholder names
      roster_lookup <- roster_lookup %>%
        mutate(
          first_name = ifelse(is.na(first_name), "Unknown", first_name),
          last_name = ifelse(is.na(last_name), "Player", last_name)
        )

      if (length(still_missing_ids) > 0) {
        cat(paste("  -", length(still_missing_ids), "truly unknown (not in roster or PBP)\n"))
        placeholder_players <- data.frame(
          player_id = still_missing_ids,
          first_name = "Unknown",
          last_name = "Player",
          first_season = as.integer(format(Sys.Date(), "%Y")),
          last_season = as.integer(format(Sys.Date(), "%Y")),
          stringsAsFactors = FALSE
        )
        roster_lookup <- bind_rows(roster_lookup, placeholder_players)
      }

      dbWriteTable(con, "players", roster_lookup,
                   append = TRUE, row.names = FALSE, overwrite = FALSE)
      cat(paste("Inserted", nrow(roster_lookup), "missing player records\n"))
    }

    close_db_connection(con)
    return(TRUE)

  }, error = function(e) {
    cat(paste("Failed to ensure players exist:", e$message, "\n"))
    close_db_connection(con)
    return(FALSE)
  })
}

load_player_stats <- function(player_stats, player_data = NULL, pbp_data = NULL) {
  cat(paste("Loading", nrow(player_stats), "player-week records...\n"))
  ensure_players_exist(player_stats, player_data, pbp_data)

  con <- get_db_connection()
  if (is.null(con)) return(FALSE)

  tryCatch({
    dbWriteTable(con, "player_week", player_stats,
                 append = TRUE, row.names = FALSE, overwrite = FALSE)
    cat(paste("Loaded", nrow(player_stats), "player-week records\n"))

    close_db_connection(con)
    return(TRUE)

  }, error = function(e) {
    cat(paste("Failed to load player stats:", e$message, "\n"))
    close_db_connection(con)
    return(FALSE)
  })
}

load_team_stats <- function(team_stats) {
  cat(paste("Loading", nrow(team_stats), "team-week records...\n"))

  con <- get_db_connection()
  if (is.null(con)) return(FALSE)

  tryCatch({
    dbWriteTable(con, "team_week", team_stats,
                 append = TRUE, row.names = FALSE, overwrite = FALSE)
    cat(paste("Loaded", nrow(team_stats), "team-week records\n"))

    close_db_connection(con)
    return(TRUE)

  }, error = function(e) {
    cat(paste("Failed to load team stats:", e$message, "\n"))
    close_db_connection(con)
    return(FALSE)
  })
}

clear_season_data <- function(season) {
  cat(paste("Clearing existing data for season", season, "...\n"))

  con <- get_db_connection()
  if (is.null(con)) return(FALSE)

  tryCatch({
    # Order matters due to foreign keys
    dbExecute(con, "DELETE FROM player_week WHERE season = $1", params = list(season))
    dbExecute(con, "DELETE FROM team_week WHERE season = $1", params = list(season))
    dbExecute(con, "DELETE FROM weeks WHERE season = $1", params = list(season))

    cat(paste("Cleared existing data for season", season, "\n"))

    close_db_connection(con)
    return(TRUE)

  }, error = function(e) {
    cat(paste("Failed to clear season data:", e$message, "\n"))
    close_db_connection(con)
    return(FALSE)
  })
}
