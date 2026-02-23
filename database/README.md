# NFL Database Schema

Complete PostgreSQL/Supabase database setup for NFL statistics.

## Files

- **`setup_database.sql`** - Master setup script (runs all files in correct order)
- **`schema.sql`** - Creates all tables, indexes, and constraints
- **`policies.sql`** - Row Level Security policies (fixes "unrestricted" error)
- **`functions.sql`** - Query functions for player and team statistics

## Setup Instructions

### Option 1: Run Master Script (Recommended)
```sql
\i setup_database.sql
```

### Option 2: Run Files Manually
```sql
-- 1. Create schema
\i schema.sql

-- 2. Set up RLS policies
\i policies.sql

-- 3. Create functions
\i functions.sql
```

## Database Schema

### Core Tables
- **`players`** - Player information and metadata
- **`teams`** - Team information and metadata
- **`weeks`** - Season and week reference data
- **`player_week`** - Weekly player statistics (populated by ETL)
- **`team_week`** - Weekly team statistics (populated by ETL)

### Functions
- **`player_stats()`** - Query player statistics with flexible filtering
- **`team_stats()`** - Query team statistics with flexible filtering

## RLS Policies

The `policies.sql` file creates permissive Row Level Security policies that allow full access to all tables. This fixes the Supabase "unrestricted" error.

### Current Policy: Full Access
```sql
-- Example: players table policy
CREATE POLICY "players_access_policy" 
ON players 
FOR ALL 
TO public
USING (true)
WITH CHECK (true);
```

### Production Consideration
For production use, you may want to implement more restrictive policies based on your application's authentication needs.

## Usage Examples

After setup, you can use the query functions:

```sql
-- Get Lamar Jackson's 2024 stats
SELECT * FROM player_stats('L.Jackson', 2024, 2024, NULL, NULL, 'REG');

-- Get Ravens' 2024 team stats
SELECT * FROM team_stats('BAL', 2024, 2024, NULL, NULL, 'REG');
```

## Troubleshooting

### "unrestricted" Error
If you see this error in Supabase, run:
```sql
\i policies.sql
```

### Function Type Errors
The functions.sql file includes proper `::int` casts to handle PostgreSQL's BIGINT vs INTEGER differences.

### Connection Issues
Make sure your `.env` file has the correct database credentials:
```
NFL_DB_NAME=your_db_name
NFL_DB_HOST=your_host
NFL_DB_PORT=5432
NFL_DB_USER=your_user
NFL_DB_PASSWORD=your_password
NFL_DB_SSLMODE=require
```