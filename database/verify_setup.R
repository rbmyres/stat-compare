# Database Setup Verification Script
# Tests that the database is properly configured

# Load environment variables first
if (file.exists(".env")) {
  readRenviron(".env")
} else if (file.exists("../etl/.env")) {
  readRenviron("../etl/.env")
}

# Load database configuration
source("../etl/config/database.R")

cat("=== Database Setup Verification ===\n")

# Test 1: Database connection
cat("1. Testing database connection...\n")
con <- get_db_connection()
if (is.null(con)) {
  cat("❌ Database connection failed. Check your .env file.\n")
  quit(status = 1)
}

# Test 2: Check if tables exist
cat("2. Checking if tables exist...\n")
tryCatch({
  tables <- dbGetQuery(con, "
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('players', 'teams', 'weeks', 'player_week', 'team_week')
    ORDER BY table_name")
  
  expected_tables <- c("players", "teams", "weeks", "player_week", "team_week")
  missing_tables <- setdiff(expected_tables, tables$table_name)
  
  if (length(missing_tables) > 0) {
    cat("❌ Missing tables:", paste(missing_tables, collapse = ", "), "\n")
    cat("Please run: setup_database.sql\n")
  } else {
    cat("✓ All required tables exist\n")
  }
}, error = function(e) {
  cat("❌ Error checking tables:", e$message, "\n")
})

# Test 3: Check RLS policies  
cat("3. Checking Row Level Security policies...\n")
tryCatch({
  policies <- dbGetQuery(con, "
    SELECT tablename, COUNT(*) as policy_count
    FROM pg_policies 
    WHERE schemaname = 'public'
    AND tablename IN ('players', 'teams', 'weeks', 'player_week', 'team_week')
    GROUP BY tablename
    ORDER BY tablename")
  
  if (nrow(policies) == 0) {
    cat("⚠️  No RLS policies found. Run policies.sql to fix 'unrestricted' error\n")
  } else {
    cat("✓ RLS policies configured:\n")
    for (i in 1:nrow(policies)) {
      cat(paste("  -", policies$tablename[i], ":", policies$policy_count[i], "policies\n"))
    }
  }
}, error = function(e) {
  cat("⚠️  Could not check RLS policies:", e$message, "\n")
})

# Test 4: Test table access (should not give "unrestricted" error)
cat("4. Testing table access...\n")
tryCatch({
  # Try to query each table (should work without "unrestricted" error)
  test_tables <- c("players", "teams", "weeks", "player_week", "team_week")
  
  for (table in test_tables) {
    count <- dbGetQuery(con, paste("SELECT COUNT(*) as count FROM", table))
    cat(paste("  ✓", table, ":", count$count, "records\n"))
  }
  
  cat("✓ All tables accessible (no 'unrestricted' error)\n")
}, error = function(e) {
  if (grepl("unrestricted", e$message, ignore.case = TRUE)) {
    cat("❌ 'Unrestricted' error found. Run policies.sql to fix.\n")
  } else {
    cat("❌ Table access error:", e$message, "\n")
  }
})

# Test 5: Check if functions exist
cat("5. Checking database functions...\n")
tryCatch({
  functions <- dbGetQuery(con, "
    SELECT routine_name 
    FROM information_schema.routines 
    WHERE routine_schema = 'public' 
    AND routine_name IN ('player_stats', 'team_stats')
    ORDER BY routine_name")
  
  expected_functions <- c("player_stats", "team_stats")
  missing_functions <- setdiff(expected_functions, functions$routine_name)
  
  if (length(missing_functions) > 0) {
    cat("⚠️  Missing functions:", paste(missing_functions, collapse = ", "), "\n")
    cat("Run functions.sql to create them.\n")
  } else {
    cat("✓ All database functions exist\n")
  }
}, error = function(e) {
  cat("⚠️  Could not check functions:", e$message, "\n")
})

close_db_connection(con)

cat("\n=== Verification Complete ===\n")
cat("If all tests pass, your database is ready for the ETL pipeline!\n")