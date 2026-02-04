# Database Configuration
# Manages PostgreSQL/Supabase database connections

library(RPostgres)
library(DBI)

# Load environment variables
if (file.exists(".env")) {
  readRenviron(".env")
}

# Get database connection
get_db_connection <- function() {
  tryCatch({
    conn <- dbConnect(
      RPostgres::Postgres(),
      dbname = Sys.getenv("NFL_DB_NAME"),
      host = Sys.getenv("NFL_DB_HOST"),
      port = as.numeric(Sys.getenv("NFL_DB_PORT")),
      user = Sys.getenv("NFL_DB_USER"),
      password = Sys.getenv("NFL_DB_PASSWORD"),
      sslmode = Sys.getenv("NFL_DB_SSLMODE", "prefer")
    )
    
    cat("✓ Database connection established\n")
    return(conn)
  }, error = function(e) {
    cat(paste("❌ Database connection failed:", e$message, "\n"))
    return(NULL)
  })
}

# Close database connection
close_db_connection <- function(conn) {
  if (!is.null(conn)) {
    dbDisconnect(conn)
    cat("✓ Database connection closed\n")
  }
}

# Test database connection
test_db_connection <- function() {
  conn <- get_db_connection()
  if (is.null(conn)) return(FALSE)
  
  tryCatch({
    result <- dbGetQuery(conn, "SELECT 1 as test")
    cat("✓ Database test query successful\n")
    close_db_connection(conn)
    return(TRUE)
  }, error = function(e) {
    cat(paste("❌ Database test failed:", e$message, "\n"))
    close_db_connection(conn)
    return(FALSE)
  })
}