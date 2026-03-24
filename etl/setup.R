# ETL Setup - Install required R packages

cat("=== NFL ETL Package Installation ===\n")

required_packages <- c(
  "nflreadr",
  "RPostgres",
  "DBI",
  "dplyr",
  "tidyr",
  "logger"
)

install_if_missing <- function(package) {
  if (!require(package, character.only = TRUE)) {
    cat(paste("Installing", package, "...\n"))
    install.packages(package, dependencies = TRUE)

    if (require(package, character.only = TRUE)) {
      cat(paste(package, "installed successfully\n"))
    } else {
      cat(paste("Failed to install", package, "\n"))
      return(FALSE)
    }
  } else {
    cat(paste(package, "already installed\n"))
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
  cat("\nAll packages installed successfully!\n")
} else {
  cat("\nSome packages failed to install. Check errors above.\n")
}

if (!file.exists(".env")) {
  cat("\n.env file not found!\n")
  cat("Create a .env file with your database credentials:\n")
  cat("NFL_DB_NAME=your_db_name\n")
  cat("NFL_DB_HOST=your_host\n")
  cat("NFL_DB_PORT=5432\n")
  cat("NFL_DB_USER=your_user\n")
  cat("NFL_DB_PASSWORD=your_password\n")
  cat("NFL_DB_SSLMODE=require\n")
} else {
  cat(".env file found\n")
}
