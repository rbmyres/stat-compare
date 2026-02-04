# Run 2024 Season ETL
library(dplyr)
library(logger)

source("config/database.R")
source("src/extract.R")
source("src/transform_players.R")
source("src/transform_teams.R")
source("src/load.R")
source("src/utils.R")
source("src/etl_pipeline.R")

cat("=== 2024 NFL Season ETL ===\n")
cat("This script will:\n")
cat("1. Clear any existing 2024 data\n")
cat("2. Extract 2024 play-by-play and player data\n")
cat("3. Transform into player_week and team_week format\n")
cat("4. Load into your database\n")
cat("5. Run validation queries\n\n")

success <- run_etl_pipeline(
  seasons = 2024,
  clear_existing = TRUE
)

if (!success) {
  cat("❌ ETL pipeline failed. Please check the errors above.\n")
  quit(status = 1)
}

cat("\n🎉 2024 ETL Complete!\n")
cat("Your database should now contain 2024 NFL statistics.\n")