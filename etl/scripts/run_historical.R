# Historical ETL Backfill Script
# Loads all available NFL seasons (1999-2024) into the database
# Warning: This is a long-running operation that may take several hours

# Load all required libraries upfront
library(dplyr)
library(logger)

# Load all modules with explicit paths from etl directory
source("config/database.R")
source("src/extract.R")
source("src/transform_players.R")
source("src/transform_teams.R")
source("src/load.R")
source("src/utils.R")
source("src/etl_pipeline.R")

cat("=== NFL Historical Data ETL ===\n")
cat("This script will backfill all NFL seasons from 1999-2024\n")
cat("⚠️  This will take a significant amount of time!\n\n")

# Confirm before running
if (interactive()) {
  response <- readline("Are you sure you want to run the full historical backfill? (y/N): ")
  if (tolower(response) != "y") {
    cat("Cancelled.\n")
    quit()
  }
}

# Define seasons to backfill (dynamically includes current year)
current_year <- as.integer(format(Sys.Date(), "%Y"))
seasons <- 1999:current_year

cat(paste("Processing", length(seasons), "seasons...\n"))

# Run the ETL pipeline for all seasons
success <- run_etl_pipeline(
  seasons = seasons,
  clear_existing = FALSE  # Don't clear existing data for historical runs
)

if (!success) {
  cat("❌ ETL pipeline failed. Please check the errors above.\n")
  quit(status = 1)
}

# Final validation
con <- get_db_connection()
if (!is.null(con)) {
  total_players <- dbGetQuery(con, "SELECT COUNT(*) as count FROM player_week")
  total_teams <- dbGetQuery(con, "SELECT COUNT(*) as count FROM team_week")
  seasons_loaded <- dbGetQuery(con, "SELECT COUNT(DISTINCT season) as count FROM player_week")
  
  cat(paste("\n✅ Historical backfill complete!\n"))
  cat(paste("- Total player-week records:", total_players$count, "\n"))
  cat(paste("- Total team-week records:", total_teams$count, "\n"))
  cat(paste("- Seasons loaded:", seasons_loaded$count, "\n"))
  
  close_db_connection(con)
}

cat("\n🎉 Historical ETL Complete!\n")