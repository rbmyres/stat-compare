# Historical ETL Backfill Script
# Loads all available NFL seasons (1999-current)

library(dplyr)
library(logger)

source("config/database.R")
source("src/extract.R")
source("src/transform_players.R")
source("src/transform_teams.R")
source("src/load.R")
source("src/utils.R")
source("src/etl_pipeline.R")

cat("=== NFL Historical Data ETL ===\n")
cat("This will backfill all NFL seasons from 1999-current.\n")
cat("This will take a significant amount of time.\n\n")

if (interactive()) {
  response <- readline(
    "Are you sure you want to run the full backfill? (y/N): "
  )
  if (tolower(response) != "y") {
    cat("Cancelled.\n")
    quit()
  }
}

current_year <- as.integer(format(Sys.Date(), "%Y"))
seasons <- 1999:current_year

cat(paste("Processing", length(seasons), "seasons...\n"))

success <- run_etl_pipeline(
  seasons = seasons,
  clear_existing = FALSE
)

if (!success) {
  cat("ETL pipeline failed. Check the errors above.\n")
  quit(status = 1)
}

con <- get_db_connection()
if (!is.null(con)) {
  total_players <- dbGetQuery(
    con, "SELECT COUNT(*) as count FROM player_week"
  )
  total_teams <- dbGetQuery(
    con, "SELECT COUNT(*) as count FROM team_week"
  )
  seasons_loaded <- dbGetQuery(
    con,
    "SELECT COUNT(DISTINCT season) as count FROM player_week"
  )

  cat("\nHistorical backfill complete!\n")
  cat(paste("- Player-week records:", total_players$count, "\n"))
  cat(paste("- Team-week records:", total_teams$count, "\n"))
  cat(paste("- Seasons loaded:", seasons_loaded$count, "\n"))

  close_db_connection(con)
}
