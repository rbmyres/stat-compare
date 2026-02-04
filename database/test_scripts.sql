-- Query Player Stats Template
-- Replace parameters below with desired values:
-- 
-- :short_name - Player short name (e.g., 'L.Jackson', 'J.Burrow', 'P.Mahomes')
-- :season_start - Start season (e.g., 2024)
-- :season_end - End season (e.g., 2024) 
-- :week_start - Start week (e.g., 1)
-- :week_end - End week (e.g., 18)
-- :season_type - Season type ('REG', 'POST', 'PRE')
--
-- Example usage:
SELECT * FROM player_stats('00-0034796', 2024, 2024, 1, 18, 'REG');

-- \set short_name 'L.Jackson'
-- \set season_start 2024
-- \set season_end 2024  
-- \set week_start 1
-- \set week_end 18
-- \set season_type 'REG'

-- Execute the query
-- SELECT * FROM player_stats('M.Andrews', 2024 , 2024, 1, 18, 'REG');

-- Query Team Stats Template
-- Replace parameters below with desired values:
--
-- :team_id - Team ID (e.g., 'BAL', 'CIN', 'KC', 'BUF')
-- :season_start - Start season (e.g., 2024)
-- :season_end - End season (e.g., 2024)
-- :week_start - Start week (e.g., 1)
-- :week_end - End week (e.g., 18)
-- :season_type - Season type ('REG', 'POST', 'PRE')
--
-- Example usage:
-- SELECT * FROM team_stats('BAL', 2024, 2024, 1, 18, 'REG');

-- \set team_id 'BAL'
-- \set season_start 2024
-- \set season_end 2024
-- \set week_start 1
-- \set week_end 18
-- \set season_type 'REG'

-- Execute the query
-- SELECT * FROM team_stats('BAL', 2024, 2024, 1, 18, 'REG');