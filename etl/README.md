# NFL ETL Pipeline

A clean, modular ETL pipeline for extracting, transforming, and loading NFL statistics from nflverse data into a PostgreSQL database.

## Quick Start

1. **Install Dependencies**
   ```r
   source("setup.R")
   ```

2. **Configure Database**
   - Create a `.env` file with your database credentials:
   ```
   NFL_DB_NAME=your_db_name
   NFL_DB_HOST=your_host
   NFL_DB_PORT=5432
   NFL_DB_USER=your_user
   NFL_DB_PASSWORD=your_password
   NFL_DB_SSLMODE=require
   ```

3. **Run ETL Pipeline**
   ```r
   # Load 2024 season only (for testing)
   source("scripts/run_2024.R")
   
   # Or load all historical data (1999-2024)
   source("scripts/run_historical.R")
   ```

## Project Structure

```
etl/
├── setup.R                    # Package installation
├── config/
│   └── database.R            # Database connection management
├── src/
│   ├── etl_pipeline.R        # Main ETL orchestrator
│   ├── extract.R             # Data extraction from nflverse
│   ├── transform_players.R   # Player statistics transformation
│   ├── transform_teams.R     # Team statistics transformation
│   ├── load.R               # Database loading functions
│   └── utils.R              # Utility functions and data enhancement
├── scripts/
│   ├── run_2024.R           # Run 2024 season ETL
│   └── run_historical.R     # Run full historical backfill
└── reference/
    └── example_scripts/      # Original verified calculation formulas
```

## Features

- **Modular Architecture**: Clean separation of concerns
- **Verified Statistics**: Uses exact calculation formulas from reference scripts
- **Performance Optimized**: Vectorized operations for fast processing
- **Error Handling**: Retry mechanisms and comprehensive error reporting
- **Progress Tracking**: Real-time progress updates for long operations
- **Database Integration**: Full PostgreSQL compatibility

## Data Sources

- **nflverse**: Play-by-play data, player information, team data, schedules
- **Coverage**: 1999-2024 NFL seasons (regular season and playoffs)
- **Statistics**: Comprehensive player and team statistics with advanced metrics (EPA, CPOE, success rate)

## Database Schema

The pipeline populates these tables:
- `players` - Player information and metadata
- `teams` - Team information and metadata  
- `weeks` - Season and week reference data
- `player_week` - Weekly player statistics
- `team_week` - Weekly team statistics

## Usage Examples

```r
# Load specific seasons
source("src/etl_pipeline.R")
run_etl_pipeline(seasons = c(2022, 2023, 2024))

# Clear and reload data
run_etl_pipeline(seasons = 2024, clear_existing = TRUE)
```

## Requirements

- R 4.0+
- PostgreSQL database
- Required R packages (installed via setup.R):
  - nflreadr
  - RPostgres  
  - DBI
  - dplyr
  - tidyr
  - logger