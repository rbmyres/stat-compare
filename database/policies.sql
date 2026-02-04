-- Row Level Security Policies
-- Implements role-based access control for database tables
--
-- Roles:
--   - anon: Anonymous users (read-only access to public data)
--   - authenticated: Logged-in users (read-only access to public data)
--   - service_role: Backend/ETL services (full access for data loading)

BEGIN;

-- Enable RLS on all tables (if not already enabled)
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_week ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_week ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to start fresh
DROP POLICY IF EXISTS "players_access_policy" ON players;
DROP POLICY IF EXISTS "teams_access_policy" ON teams;
DROP POLICY IF EXISTS "weeks_access_policy" ON weeks;
DROP POLICY IF EXISTS "player_week_access_policy" ON player_week;
DROP POLICY IF EXISTS "team_week_access_policy" ON team_week;

DROP POLICY IF EXISTS "players_read_policy" ON players;
DROP POLICY IF EXISTS "players_write_policy" ON players;
DROP POLICY IF EXISTS "teams_read_policy" ON teams;
DROP POLICY IF EXISTS "teams_write_policy" ON teams;
DROP POLICY IF EXISTS "weeks_read_policy" ON weeks;
DROP POLICY IF EXISTS "weeks_write_policy" ON weeks;
DROP POLICY IF EXISTS "player_week_read_policy" ON player_week;
DROP POLICY IF EXISTS "player_week_write_policy" ON player_week;
DROP POLICY IF EXISTS "team_week_read_policy" ON team_week;
DROP POLICY IF EXISTS "team_week_write_policy" ON team_week;

-- Players table policies
-- Read: Allow anonymous and authenticated users to read all player data
CREATE POLICY "players_read_policy"
ON players
FOR SELECT
TO anon, authenticated
USING (true);

-- Write: Only service_role can insert/update/delete player data
CREATE POLICY "players_write_policy"
ON players
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Teams table policies
-- Read: Allow anonymous and authenticated users to read all team data
CREATE POLICY "teams_read_policy"
ON teams
FOR SELECT
TO anon, authenticated
USING (true);

-- Write: Only service_role can insert/update/delete team data
CREATE POLICY "teams_write_policy"
ON teams
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Weeks table policies
-- Read: Allow anonymous and authenticated users to read all week data
CREATE POLICY "weeks_read_policy"
ON weeks
FOR SELECT
TO anon, authenticated
USING (true);

-- Write: Only service_role can insert/update/delete week data
CREATE POLICY "weeks_write_policy"
ON weeks
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Player_week table policies
-- Read: Allow anonymous and authenticated users to read all player stats
CREATE POLICY "player_week_read_policy"
ON player_week
FOR SELECT
TO anon, authenticated
USING (true);

-- Write: Only service_role can insert/update/delete player stats
CREATE POLICY "player_week_write_policy"
ON player_week
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Team_week table policies
-- Read: Allow anonymous and authenticated users to read all team stats
CREATE POLICY "team_week_read_policy"
ON team_week
FOR SELECT
TO anon, authenticated
USING (true);

-- Write: Only service_role can insert/update/delete team stats
CREATE POLICY "team_week_write_policy"
ON team_week
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

COMMIT;

-- Verification query: Check all policies are created correctly
SELECT
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Note: If using Supabase, the anon and authenticated roles are built-in.
-- The service_role is used by the ETL pipeline for data loading.
-- Ensure your ETL connection uses the service_role key, not the anon key.