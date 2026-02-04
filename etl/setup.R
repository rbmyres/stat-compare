# ETL Setup Script
# Installs required R packages and validates environment for NFL ETL pipeline

cat("=== NFL ETL Package Installation ===\n")

# Required packages for NFL data processing and database connectivity
required_packages <- c(
  "nflreadr",     # NFL data from nflverse
  "RPostgres",    # PostgreSQL database connection
  "DBI",          # Database interface
  "dplyr",        # Data manipulation
  "tidyr",        # Data tidying
  "logger"        # Logging functionality
)

# Install package if not already available
# @param package: Package name to check and install
# @return: TRUE if package is available, FALSE if installation failed
install_if_missing <- function(package) {
  if (!require(package, character.only = TRUE)) {
    cat(paste("Installing", package, "...\n"))
    install.packages(package, dependencies = TRUE)
    
    if (require(package, character.only = TRUE)) {
      cat(paste("✓", package, "installed successfully\n"))
    } else {
      cat(paste("❌ Failed to install", package, "\n"))
      return(FALSE)
    }
  } else {
    cat(paste("✓", package, "already installed\n"))
  }
  return(TRUE)
}

cat("Checking and installing required packages...\n")
success <- TRUE

for (pkg in required_packages) {
  if (!install_if_missing(pkg)) {
    success <- FALSE
  }
}

if (success) {
  cat("\n🎉 All packages installed successfully!\n")
  cat("You can now run the ETL pipeline.\n")
} else {
  cat("\n❌ Some packages failed to install. Please check the errors above.\n")
}

if (!file.exists(".env")) {
  cat("\n⚠️  .env file not found!\n")
  cat("Please create a .env file with your database credentials:\n")
  cat("NFL_DB_NAME=your_db_name\n")
  cat("NFL_DB_HOST=your_host\n")
  cat("NFL_DB_PORT=5432\n")
  cat("NFL_DB_USER=your_user\n")
  cat("NFL_DB_PASSWORD=your_password\n")
  cat("NFL_DB_SSLMODE=require\n")
} else {
  cat("✓ .env file found\n")
}