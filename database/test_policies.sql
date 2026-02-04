-- Test RLS Policies
-- Quick verification that RLS policies are working correctly

-- Check if RLS is enabled on tables
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('players', 'teams', 'weeks', 'player_week', 'team_week')
ORDER BY tablename;

-- Check existing policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Test basic access to tables (should not give "unrestricted" error)
SELECT 'players' as table_name, COUNT(*) as row_count FROM players
UNION ALL
SELECT 'teams', COUNT(*) FROM teams  
UNION ALL
SELECT 'weeks', COUNT(*) FROM weeks
UNION ALL  
SELECT 'player_week', COUNT(*) FROM player_week
UNION ALL
SELECT 'team_week', COUNT(*) FROM team_week;