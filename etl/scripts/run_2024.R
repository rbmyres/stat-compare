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

success <- run_etl_pipeline(
  seasons = 2024,
  clear_existing = TRUE
)

if (!success) {
  cat("ETL pipeline failed. Check the errors above.\n")
  quit(status = 1)
}

cat("\n2024 ETL Complete!\n")
