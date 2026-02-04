BEGIN;

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS public.player_passing_base(text, int, int, int, int, text);
DROP FUNCTION IF EXISTS public.player_passing_advanced(text, int, int, int, int, text);
DROP FUNCTION IF EXISTS public.player_rushing_base(text, int, int, int, int, text);
DROP FUNCTION IF EXISTS public.player_rushing_advanced(text, int, int, int, int, text);
DROP FUNCTION IF EXISTS public.player_receiving_base(text, int, int, int, int, text);
DROP FUNCTION IF EXISTS public.player_receiving_advanced(text, int, int, int, int, text);
DROP FUNCTION IF EXISTS public.player_total_stats(text, int, int, int, int, text);

-- ============================================================================
-- PLAYER PASSING BASE STATS
-- Core passing metrics for basic stats view
-- ============================================================================
CREATE OR REPLACE FUNCTION public.player_passing_base(
    p_player_id text DEFAULT NULL,
    p_season_start int DEFAULT NULL,
    p_season_end int DEFAULT NULL, 
    p_week_start int DEFAULT NULL,
    p_week_end int DEFAULT NULL,
    p_season_type text DEFAULT 'REG'
)
RETURNS TABLE (
    -- Player identification
    player_id varchar(32),
    full_name text,
    "position" varchar(5),
    games_played int,
    
    -- Basic passing stats (customize these columns as needed)
    pass_qb_dropbacks int,
    pass_qb_dropbacks_per_game decimal(5,2),
    pass_attempts int,
    pass_attempts_per_game decimal(5,2),
    pass_completions int,
    pass_comp_percent decimal(5,2),
    pass_yards int,
    pass_yards_per_game decimal(5,2),
    pass_yards_per_attempt decimal(5,2),
    pass_yards_per_completion decimal(5,2),
    pass_touchdowns int,
    pass_td_percent decimal(5,2),
    pass_ints int,
    pass_int_percent decimal(5,2),
    pass_sacks int,
    pass_sack_yards int,
    pass_sack_percent decimal(5,2),
    pass_qb_hit int,
    pass_qb_hit_percent decimal(5,2),
    pass_first_downs int,
    pass_first_down_rate decimal(5,2),
    pass_20_plus int,
    pass_20_plus_rate decimal(5,2),
    pass_long int
) AS $$
BEGIN
    RETURN QUERY
    WITH player_totals AS (
        SELECT 
            pw.player_id,
            p.first_name,
            p.last_name,
            
            -- Game aggregations
            COUNT(*)::int as games_played,
            COALESCE(MAX(pw.position), 'UNK')::varchar(5) as primary_position,
            
            -- Raw passing stats aggregation for your exact columns
            SUM(pw.pass_qb_dropbacks)::int as agg_pass_qb_dropbacks,
            SUM(pw.pass_attempts)::int as agg_pass_attempts,
            SUM(pw.pass_completions)::int as agg_pass_completions,
            SUM(pw.pass_yards)::int as agg_pass_yards,
            SUM(pw.pass_touchdowns)::int as agg_pass_touchdowns,
            SUM(pw.pass_ints)::int as agg_pass_ints,
            SUM(pw.pass_sacks)::int as agg_pass_sacks,
            SUM(pw.pass_sack_yards)::int as agg_pass_sack_yards,
            SUM(pw.pass_qb_hits)::int as agg_pass_qb_hit,
            SUM(pw.pass_first_downs)::int as agg_pass_first_downs,
            SUM(pw.pass_20_plus)::int as agg_pass_20_plus,
            MAX(pw.pass_long)::int as agg_pass_long
            
        FROM player_week pw
        JOIN players p ON pw.player_id = p.player_id
        JOIN weeks w ON pw.season = w.season AND pw.week = w.week
        WHERE (p_player_id IS NULL OR pw.player_id = p_player_id)
          AND (p_season_start IS NULL OR pw.season >= p_season_start)
          AND (p_season_end IS NULL OR pw.season <= p_season_end)
          AND (p_week_start IS NULL OR pw.week >= p_week_start)
          AND (p_week_end IS NULL OR pw.week <= p_week_end)
          AND (p_season_type IS NULL OR w.season_type = ANY(string_to_array(p_season_type, ',')))
        GROUP BY pw.player_id, p.first_name, p.last_name
        HAVING SUM(pw.pass_attempts) > 0  -- Only include players with passing attempts
    )
    SELECT 
        pt.player_id,
        CONCAT(pt.first_name, ' ', pt.last_name) as full_name,
        pt.primary_position as "position",
        pt.games_played,
        
        -- Raw stats matching your exact columns
        pt.agg_pass_qb_dropbacks,
        ROUND(pt.agg_pass_qb_dropbacks::decimal / pt.games_played, 2) as pass_qb_dropbacks_per_game,
        pt.agg_pass_attempts,
        ROUND(pt.agg_pass_attempts::decimal / pt.games_played, 2) as pass_attempts_per_game,
        pt.agg_pass_completions,
        CASE WHEN pt.agg_pass_attempts > 0 THEN ROUND(pt.agg_pass_completions::decimal / pt.agg_pass_attempts * 100, 2) ELSE 0 END as pass_comp_percent,
        pt.agg_pass_yards,
        ROUND(pt.agg_pass_yards::decimal / pt.games_played, 2) as pass_yards_per_game,
        CASE WHEN pt.agg_pass_attempts > 0 THEN ROUND(pt.agg_pass_yards::decimal / pt.agg_pass_attempts, 2) ELSE 0 END as pass_yards_per_attempt,
        CASE WHEN pt.agg_pass_completions > 0 THEN ROUND(pt.agg_pass_yards::decimal / pt.agg_pass_completions, 2) ELSE 0 END as pass_yards_per_completion,
        pt.agg_pass_touchdowns,
        CASE WHEN pt.agg_pass_attempts > 0 THEN ROUND(pt.agg_pass_touchdowns::decimal / pt.agg_pass_attempts * 100, 2) ELSE 0 END as pass_td_percent,
        pt.agg_pass_ints,
        CASE WHEN pt.agg_pass_attempts > 0 THEN ROUND(pt.agg_pass_ints::decimal / pt.agg_pass_attempts * 100, 2) ELSE 0 END as pass_int_percent,
        pt.agg_pass_sacks,
        pt.agg_pass_sack_yards,
        CASE WHEN pt.agg_pass_qb_dropbacks > 0 THEN ROUND(pt.agg_pass_sacks::decimal / pt.agg_pass_qb_dropbacks * 100, 2) ELSE 0 END as pass_sack_percent,
        pt.agg_pass_qb_hit,
        CASE WHEN pt.agg_pass_qb_dropbacks > 0 THEN ROUND(pt.agg_pass_qb_hit::decimal / pt.agg_pass_qb_dropbacks * 100, 2) ELSE 0 END as pass_qb_hit_percent,
        pt.agg_pass_first_downs,
        CASE WHEN pt.agg_pass_attempts > 0 THEN ROUND(pt.agg_pass_first_downs::decimal / pt.agg_pass_attempts * 100, 2) ELSE 0 END as pass_first_down_rate,
        pt.agg_pass_20_plus,
        CASE WHEN pt.agg_pass_attempts > 0 THEN ROUND(pt.agg_pass_20_plus::decimal / pt.agg_pass_attempts * 100, 2) ELSE 0 END as pass_20_plus_rate,
        pt.agg_pass_long
        
    FROM player_totals pt
    ORDER BY pt.agg_pass_yards DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PLAYER PASSING ADVANCED STATS
-- Advanced passing metrics for advanced stats view
-- ============================================================================
CREATE OR REPLACE FUNCTION public.player_passing_advanced(
    p_player_id text DEFAULT NULL,
    p_season_start int DEFAULT NULL,
    p_season_end int DEFAULT NULL, 
    p_week_start int DEFAULT NULL,
    p_week_end int DEFAULT NULL,
    p_season_type text DEFAULT 'REG'
)
RETURNS TABLE (
    -- Player identification
    player_id varchar(32),
    full_name text,
    "position" varchar(5),
    games_played int,

    -- Advanced passing stats (customize these columns as needed)
    pass_epa decimal(5,2),
    pass_epa_per_dropback decimal(5,2),
    pass_epa_per_attempt decimal(5,2),
    pass_epa_per_completion decimal(5,2),
    pass_wpa decimal(5,2),
    pass_success_rate decimal(5,2),
    pass_cpoe decimal(5,2),
    pass_rating decimal(5,2),
    pass_air_yards int,
    pass_average_depth_of_target decimal(5,2),
    pass_yac_total int,
    pass_yac_per_attempt decimal(5,2),
    pass_yac_epa_total decimal(5,2),
    pass_yac_epa_per_attempt decimal(5,2),
    pass_yac_wpa_total decimal(5,2)
) AS $$
BEGIN
    RETURN QUERY
    WITH player_totals AS (
        SELECT 
            pw.player_id,
            p.first_name,
            p.last_name,
            
            -- Game aggregations
            COUNT(*)::int as games_played,
            COALESCE(MAX(pw.position), 'UNK')::varchar(5) as primary_position,
            
            -- Advanced passing stats aggregation for your exact columns
            SUM(pw.pass_qb_dropbacks)::int as agg_pass_qb_dropbacks,
            SUM(pw.pass_attempts)::int as agg_pass_attempts,
            SUM(pw.pass_completions)::int as agg_pass_completions,
            SUM(pw.pass_yards)::int as agg_pass_yards,
            SUM(pw.pass_touchdowns)::int as agg_pass_touchdowns,
            SUM(pw.pass_ints)::int as agg_pass_ints,
            SUM(pw.pass_epa) as agg_pass_epa,
            SUM(pw.pass_wpa) as agg_pass_wpa,
            SUM(pw.pass_success_total)::int as agg_pass_success_total,
            SUM(pw.pass_cpoe_total) as agg_pass_cpoe_total,
            SUM(pw.pass_air_yards)::int as agg_pass_air_yards,
            SUM(pw.pass_yac_total)::int as agg_pass_yac_total,
            SUM(pw.pass_yac_epa_total) as agg_pass_yac_epa_total,
            SUM(pw.pass_yac_wpa_total) as agg_pass_yac_wpa_total
            
        FROM player_week pw
        JOIN players p ON pw.player_id = p.player_id
        JOIN weeks w ON pw.season = w.season AND pw.week = w.week
        WHERE (p_player_id IS NULL OR pw.player_id = p_player_id)
          AND (p_season_start IS NULL OR pw.season >= p_season_start)
          AND (p_season_end IS NULL OR pw.season <= p_season_end)
          AND (p_week_start IS NULL OR pw.week >= p_week_start)
          AND (p_week_end IS NULL OR pw.week <= p_week_end)
          AND (p_season_type IS NULL OR w.season_type = ANY(string_to_array(p_season_type, ',')))
        GROUP BY pw.player_id, p.first_name, p.last_name
        HAVING SUM(pw.pass_attempts) > 0  -- Only include players with passing attempts
    )
    SELECT 
        pt.player_id,
        CONCAT(pt.first_name, ' ', pt.last_name) as full_name,
        pt.primary_position as "position",
        pt.games_played,
        
        -- Advanced stats matching your exact columns
        ROUND(pt.agg_pass_epa, 2) as pass_epa,
        CASE WHEN pt.agg_pass_qb_dropbacks > 0 THEN ROUND(pt.agg_pass_epa::decimal / pt.agg_pass_qb_dropbacks, 2) ELSE 0 END as pass_epa_per_dropback,
        CASE WHEN pt.agg_pass_attempts > 0 THEN ROUND(pt.agg_pass_epa::decimal / pt.agg_pass_attempts, 2) ELSE 0 END as pass_epa_per_attempt,
        CASE WHEN pt.agg_pass_completions > 0 THEN ROUND(pt.agg_pass_epa::decimal / pt.agg_pass_completions, 2) ELSE 0 END as pass_epa_per_completion,
        ROUND(pt.agg_pass_wpa, 2) as pass_wpa,
        CASE WHEN pt.agg_pass_attempts > 0 THEN ROUND(pt.agg_pass_success_total::decimal / pt.agg_pass_attempts * 100, 2) ELSE 0 END as pass_success_rate,
        CASE WHEN pt.agg_pass_attempts > 0 THEN ROUND(pt.agg_pass_cpoe_total::decimal / pt.agg_pass_attempts, 2) ELSE 0 END as pass_cpoe,
        
        -- Passer rating calculation
        CASE 
            WHEN pt.agg_pass_attempts >= 1 THEN 
                ROUND(GREATEST(0, LEAST(158.3, 
                    ((pt.agg_pass_completions::decimal / pt.agg_pass_attempts - 0.3) * 5 + 
                     (pt.agg_pass_yards::decimal / pt.agg_pass_attempts - 3) * 0.25 + 
                     (pt.agg_pass_touchdowns::decimal / pt.agg_pass_attempts) * 20 + 
                     (2.375 - pt.agg_pass_ints::decimal / pt.agg_pass_attempts * 25)) / 6 * 100)), 2)
            ELSE 0 
        END as pass_rating,
        
        pt.agg_pass_air_yards,
        CASE WHEN pt.agg_pass_attempts > 0 THEN ROUND(pt.agg_pass_air_yards::decimal / pt.agg_pass_attempts, 2) ELSE 0 END as pass_average_depth_of_target,
        pt.agg_pass_yac_total,
        CASE WHEN pt.agg_pass_attempts > 0 THEN ROUND(pt.agg_pass_yac_total::decimal / pt.agg_pass_attempts, 2) ELSE 0 END as pass_yac_per_attempt,
        ROUND(pt.agg_pass_yac_epa_total, 2) as pass_yac_epa_total,
        CASE WHEN pt.agg_pass_attempts > 0 THEN ROUND(pt.agg_pass_yac_epa_total::decimal / pt.agg_pass_attempts, 2) ELSE 0 END as pass_yac_epa_per_attempt,
        ROUND(pt.agg_pass_yac_wpa_total, 2) as pass_yac_wpa_total
        
    FROM player_totals pt
    ORDER BY pt.agg_pass_epa DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PLAYER RUSHING BASE STATS
-- Core rushing metrics for basic stats view
-- ============================================================================
CREATE OR REPLACE FUNCTION public.player_rushing_base(
    p_player_id text DEFAULT NULL,
    p_season_start int DEFAULT NULL,
    p_season_end int DEFAULT NULL, 
    p_week_start int DEFAULT NULL,
    p_week_end int DEFAULT NULL,
    p_season_type text DEFAULT 'REG'
)
RETURNS TABLE (
    -- Player identification
    player_id varchar(32),
    full_name text,
    "position" varchar(5),
    games_played int,
    
    -- Basic rushing stats (customize these columns as needed)
    rush_attempts int,
    rush_attempts_per_game decimal(5,2),
    rush_yards int,
    rush_yards_per_game decimal(5,2),
    rush_yards_per_carry decimal(5,2),
    rush_touchdowns int,
    rush_touchdown_rate decimal(5,2),
    rush_first_downs int,
    rush_first_down_rate decimal(5,2),
    rush_10_plus int,
    rush_10_plus_rate decimal(5,2),
    rush_20_plus int,
    rush_20_plus_rate decimal(5,2),
    rush_fumbles int,
    rush_fumbles_lost int,

    -- Basic Scramble stats
    qb_scramble_attempts int,
    qb_scramble_attempts_per_game decimal(5,2),
    qb_scramble_yards int,
    qb_scramble_yards_per_game decimal(5,2),
    qb_scramble_yards_per_carry decimal(5,2),
    qb_scramble_touchdowns int

) AS $$
BEGIN
    RETURN QUERY
    WITH player_totals AS (
        SELECT 
            pw.player_id,
            p.first_name,
            p.last_name,
            
            -- Game aggregations
            COUNT(*)::int as games_played,
            COALESCE(MAX(pw.position), 'UNK')::varchar(5) as primary_position,
            
            -- Raw rushing stats aggregation for your exact columns
            SUM(pw.rush_attempts)::int as agg_rush_attempts,
            SUM(pw.rush_yards)::int as agg_rush_yards,
            SUM(pw.rush_touchdowns)::int as agg_rush_touchdowns,
            SUM(pw.rush_first_downs)::int as agg_rush_first_downs,
            SUM(pw.rush_10_plus)::int as agg_rush_10_plus,
            SUM(pw.rush_20_plus)::int as agg_rush_20_plus,
            SUM(pw.rush_fumbles)::int as agg_rush_fumbles,
            SUM(pw.rush_fumbles_lost)::int as agg_rush_fumbles_lost,
            
            -- QB Scramble stats aggregation
            SUM(pw.qb_scramble_attempts)::int as agg_qb_scramble_attempts,
            SUM(pw.qb_scramble_yards)::int as agg_qb_scramble_yards,
            SUM(pw.qb_scramble_touchdowns)::int as agg_qb_scramble_touchdowns
            
        FROM player_week pw
        JOIN players p ON pw.player_id = p.player_id
        JOIN weeks w ON pw.season = w.season AND pw.week = w.week
        WHERE (p_player_id IS NULL OR pw.player_id = p_player_id)
          AND (p_season_start IS NULL OR pw.season >= p_season_start)
          AND (p_season_end IS NULL OR pw.season <= p_season_end)
          AND (p_week_start IS NULL OR pw.week >= p_week_start)
          AND (p_week_end IS NULL OR pw.week <= p_week_end)
          AND (p_season_type IS NULL OR w.season_type = ANY(string_to_array(p_season_type, ',')))
        GROUP BY pw.player_id, p.first_name, p.last_name
        HAVING SUM(pw.rush_attempts) > 0 OR SUM(pw.qb_scramble_attempts) > 0  -- Include players with rushing or scramble attempts
    )
    SELECT 
        pt.player_id,
        CONCAT(pt.first_name, ' ', pt.last_name) as full_name,
        pt.primary_position as "position",
        pt.games_played,
        
        -- Rushing stats matching your exact columns
        pt.agg_rush_attempts,
        ROUND(pt.agg_rush_attempts::decimal / pt.games_played, 2) as rush_attempts_per_game,
        pt.agg_rush_yards,
        ROUND(pt.agg_rush_yards::decimal / pt.games_played, 2) as rush_yards_per_game,
        CASE WHEN pt.agg_rush_attempts > 0 THEN ROUND(pt.agg_rush_yards::decimal / pt.agg_rush_attempts, 2) ELSE 0 END as rush_yards_per_carry,
        pt.agg_rush_touchdowns,
        CASE WHEN pt.agg_rush_attempts > 0 THEN ROUND(pt.agg_rush_touchdowns::decimal / pt.agg_rush_attempts * 100, 2) ELSE 0 END as rush_touchdown_rate,
        pt.agg_rush_first_downs,
        CASE WHEN pt.agg_rush_attempts > 0 THEN ROUND(pt.agg_rush_first_downs::decimal / pt.agg_rush_attempts * 100, 2) ELSE 0 END as rush_first_down_rate,
        pt.agg_rush_10_plus,
        CASE WHEN pt.agg_rush_attempts > 0 THEN ROUND(pt.agg_rush_10_plus::decimal / pt.agg_rush_attempts * 100, 2) ELSE 0 END as rush_10_plus_rate,
        pt.agg_rush_20_plus,
        CASE WHEN pt.agg_rush_attempts > 0 THEN ROUND(pt.agg_rush_20_plus::decimal / pt.agg_rush_attempts * 100, 2) ELSE 0 END as rush_20_plus_rate,
        pt.agg_rush_fumbles,
        pt.agg_rush_fumbles_lost,
        
        -- QB Scramble stats matching your exact columns
        pt.agg_qb_scramble_attempts,
        ROUND(pt.agg_qb_scramble_attempts::decimal / pt.games_played, 2) as qb_scramble_attempts_per_game,
        pt.agg_qb_scramble_yards,
        ROUND(pt.agg_qb_scramble_yards::decimal / pt.games_played, 2) as qb_scramble_yards_per_game,
        CASE WHEN pt.agg_qb_scramble_attempts > 0 THEN ROUND(pt.agg_qb_scramble_yards::decimal / pt.agg_qb_scramble_attempts, 2) ELSE 0 END as qb_scramble_yards_per_carry,
        pt.agg_qb_scramble_touchdowns
        
    FROM player_totals pt
    ORDER BY pt.agg_rush_yards DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PLAYER RUSHING ADVANCED STATS
-- Advanced rushing metrics for advanced stats view
-- ============================================================================
CREATE OR REPLACE FUNCTION public.player_rushing_advanced(
    p_player_id text DEFAULT NULL,
    p_season_start int DEFAULT NULL,
    p_season_end int DEFAULT NULL, 
    p_week_start int DEFAULT NULL,
    p_week_end int DEFAULT NULL,
    p_season_type text DEFAULT 'REG'
)
RETURNS TABLE (
    -- Player identification
    player_id varchar(32),
    full_name text,
    "position" varchar(5),
    games_played int,
    
    -- Advanced rushing stats (customize these columns as needed)
    rush_epa_total decimal(5,2),
    rush_epa_per_attempt decimal(5,2),
    rush_wpa_total decimal(5,2),
    rush_success_rate decimal(5,2),
    rush_stuffs int,
    rush_stuff_rate decimal(5,2),

    -- Advance qb scramble stats
    qb_scramble_epa_total decimal(5,2),
    qb_scramble_epa_per_carry decimal(5,2),
    qb_scramble_wpa_total decimal(5,2),
    qb_scramble_success_rate decimal(5,2)
) AS $$
BEGIN
    RETURN QUERY
    WITH player_totals AS (
        SELECT 
            pw.player_id,
            p.first_name,
            p.last_name,
            
            -- Game aggregations
            COUNT(*)::int as games_played,
            COALESCE(MAX(pw.position), 'UNK')::varchar(5) as primary_position,
            
            -- Advanced rushing stats aggregation for your exact columns
            SUM(pw.rush_attempts)::int as agg_rush_attempts,
            SUM(pw.rush_epa_total) as agg_rush_epa_total,
            SUM(pw.rush_wpa_total) as agg_rush_wpa_total,
            SUM(pw.rush_success_total)::int as agg_rush_success_total,
            SUM(pw.rush_stuffs)::int as agg_rush_stuffs,
            
            -- QB Scramble advanced stats aggregation
            SUM(pw.qb_scramble_attempts)::int as agg_qb_scramble_attempts,
            SUM(pw.qb_scramble_epa_total) as agg_qb_scramble_epa_total,
            SUM(pw.qb_scramble_wpa_total) as agg_qb_scramble_wpa_total,
            SUM(pw.qb_scramble_success_total)::int as agg_qb_scramble_success_total
            
        FROM player_week pw
        JOIN players p ON pw.player_id = p.player_id
        JOIN weeks w ON pw.season = w.season AND pw.week = w.week
        WHERE (p_player_id IS NULL OR pw.player_id = p_player_id)
          AND (p_season_start IS NULL OR pw.season >= p_season_start)
          AND (p_season_end IS NULL OR pw.season <= p_season_end)
          AND (p_week_start IS NULL OR pw.week >= p_week_start)
          AND (p_week_end IS NULL OR pw.week <= p_week_end)
          AND (p_season_type IS NULL OR w.season_type = ANY(string_to_array(p_season_type, ',')))
        GROUP BY pw.player_id, p.first_name, p.last_name
        HAVING SUM(pw.rush_attempts) > 0 OR SUM(pw.qb_scramble_attempts) > 0  -- Include players with rushing or scramble attempts
    )
    SELECT 
        pt.player_id,
        CONCAT(pt.first_name, ' ', pt.last_name) as full_name,
        pt.primary_position as "position",
        pt.games_played,
        
        -- Advanced rushing stats matching your exact columns
        ROUND(pt.agg_rush_epa_total, 2) as rush_epa_total,
        CASE WHEN pt.agg_rush_attempts > 0 THEN ROUND(pt.agg_rush_epa_total::decimal / pt.agg_rush_attempts, 2) ELSE 0 END as rush_epa_per_attempt,
        ROUND(pt.agg_rush_wpa_total, 2) as rush_wpa_total,
        CASE WHEN pt.agg_rush_attempts > 0 THEN ROUND(pt.agg_rush_success_total::decimal / pt.agg_rush_attempts * 100, 2) ELSE 0 END as rush_success_rate,
        pt.agg_rush_stuffs,
        CASE WHEN pt.agg_rush_attempts > 0 THEN ROUND(pt.agg_rush_stuffs::decimal / pt.agg_rush_attempts * 100, 2) ELSE 0 END as rush_stuff_rate,
        
        -- Advanced QB Scramble stats matching your exact columns
        ROUND(pt.agg_qb_scramble_epa_total, 2) as qb_scramble_epa_total,
        CASE WHEN pt.agg_qb_scramble_attempts > 0 THEN ROUND(pt.agg_qb_scramble_epa_total::decimal / pt.agg_qb_scramble_attempts, 2) ELSE 0 END as qb_scramble_epa_per_carry,
        ROUND(pt.agg_qb_scramble_wpa_total, 2) as qb_scramble_wpa_total,
        CASE WHEN pt.agg_qb_scramble_attempts > 0 THEN ROUND(pt.agg_qb_scramble_success_total::decimal / pt.agg_qb_scramble_attempts * 100, 2) ELSE 0 END as qb_scramble_success_rate
        
    FROM player_totals pt
    ORDER BY pt.agg_rush_epa_total DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PLAYER RECEIVING BASE STATS
-- Core receiving metrics for basic stats view
-- ============================================================================
CREATE OR REPLACE FUNCTION public.player_receiving_base(
    p_player_id text DEFAULT NULL,
    p_season_start int DEFAULT NULL,
    p_season_end int DEFAULT NULL, 
    p_week_start int DEFAULT NULL,
    p_week_end int DEFAULT NULL,
    p_season_type text DEFAULT 'REG'
)
RETURNS TABLE (
    -- Player identification
    player_id varchar(32),
    full_name text,
    "position" varchar(5),
    games_played int,
    
    -- Basic receiving stats (customize these columns as needed)
    rec_targets int,
    rec_targets_per_game decimal(5,2),
    rec_receptions int,
    rec_receptions_per_game decimal(5,2),
    rec_catch_rate decimal(5,2),
    rec_yards int,
    rec_yards_per_game decimal(5,2),
    rec_yards_per_target decimal(5,2),
    rec_yards_per_reception decimal(5,2),
    rec_touchdowns int,
    rec_touchdown_rate decimal(5,2),
    rec_first_downs int,
    rec_first_down_rate decimal(5,2),
    rec_20_plus int,
    rec_20_plus_rate decimal(5,2),
    rec_long int,
    rec_fumbles int,
    rec_fumbles_lost int

) AS $$
BEGIN
    RETURN QUERY
    WITH player_totals AS (
        SELECT 
            pw.player_id,
            p.first_name,
            p.last_name,
            COALESCE(MAX(pw.position), 'UNK')::varchar(5) as position,
            
            -- Game aggregations
            COUNT(*)::int as games_played,
            
            -- Raw receiving stats aggregation for your exact columns
            SUM(pw.rec_targets)::int as agg_rec_targets,
            SUM(pw.rec_receptions)::int as agg_rec_receptions,
            SUM(pw.rec_yards)::int as agg_rec_yards,
            SUM(pw.rec_touchdowns)::int as agg_rec_touchdowns,
            SUM(pw.rec_first_downs)::int as agg_rec_first_downs,
            SUM(pw.rec_20_plus)::int as agg_rec_20_plus,
            MAX(pw.rec_long)::int as agg_rec_long,
            SUM(pw.rec_fumbles)::int as agg_rec_fumbles,
            SUM(pw.rec_fumbles_lost)::int as agg_rec_fumbles_lost
            
        FROM player_week pw
        JOIN players p ON pw.player_id = p.player_id
        JOIN weeks w ON pw.season = w.season AND pw.week = w.week
        WHERE (p_player_id IS NULL OR pw.player_id = p_player_id)
          AND (p_season_start IS NULL OR pw.season >= p_season_start)
          AND (p_season_end IS NULL OR pw.season <= p_season_end)
          AND (p_week_start IS NULL OR pw.week >= p_week_start)
          AND (p_week_end IS NULL OR pw.week <= p_week_end)
          AND (p_season_type IS NULL OR w.season_type = ANY(string_to_array(p_season_type, ',')))
        GROUP BY pw.player_id, p.first_name, p.last_name
        HAVING SUM(pw.rec_targets) > 0  -- Only include players with targets
    )
    SELECT 
        pt.player_id,
        CONCAT(pt.first_name, ' ', pt.last_name) as full_name,
        pt.position as "position",
        pt.games_played,
        
        -- Receiving stats matching your exact columns
        pt.agg_rec_targets,
        ROUND(pt.agg_rec_targets::decimal / pt.games_played, 2) as rec_targets_per_game,
        pt.agg_rec_receptions,
        ROUND(pt.agg_rec_receptions::decimal / pt.games_played, 2) as rec_receptions_per_game,
        CASE WHEN pt.agg_rec_targets > 0 THEN ROUND(pt.agg_rec_receptions::decimal / pt.agg_rec_targets * 100, 2) ELSE 0 END as rec_catch_rate,
        pt.agg_rec_yards,
        ROUND(pt.agg_rec_yards::decimal / pt.games_played, 2) as rec_yards_per_game,
        CASE WHEN pt.agg_rec_targets > 0 THEN ROUND(pt.agg_rec_yards::decimal / pt.agg_rec_targets, 2) ELSE 0 END as rec_yards_per_target,
        CASE WHEN pt.agg_rec_receptions > 0 THEN ROUND(pt.agg_rec_yards::decimal / pt.agg_rec_receptions, 2) ELSE 0 END as rec_yards_per_reception,
        pt.agg_rec_touchdowns,
        CASE WHEN pt.agg_rec_targets > 0 THEN ROUND(pt.agg_rec_touchdowns::decimal / pt.agg_rec_targets * 100, 2) ELSE 0 END as rec_touchdown_rate,
        pt.agg_rec_first_downs,
        CASE WHEN pt.agg_rec_targets > 0 THEN ROUND(pt.agg_rec_first_downs::decimal / pt.agg_rec_targets * 100, 2) ELSE 0 END as rec_first_down_rate,
        pt.agg_rec_20_plus,
        CASE WHEN pt.agg_rec_targets > 0 THEN ROUND(pt.agg_rec_20_plus::decimal / pt.agg_rec_targets * 100, 2) ELSE 0 END as rec_20_plus_rate,
        pt.agg_rec_long,
        pt.agg_rec_fumbles,
        pt.agg_rec_fumbles_lost
        
    FROM player_totals pt
    ORDER BY pt.agg_rec_yards DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PLAYER RECEIVING ADVANCED STATS
-- Advanced receiving metrics for advanced stats view
-- ============================================================================
CREATE OR REPLACE FUNCTION public.player_receiving_advanced(
    p_player_id text DEFAULT NULL,
    p_season_start int DEFAULT NULL,
    p_season_end int DEFAULT NULL, 
    p_week_start int DEFAULT NULL,
    p_week_end int DEFAULT NULL,
    p_season_type text DEFAULT 'REG'
)
RETURNS TABLE (
    -- Player identification
    player_id varchar(32),
    full_name text,
    "position" varchar(5),
    games_played int,
    
    -- Advanced receiving stats (customize these columns as needed)
    rec_epa_total decimal(5,2),
    rec_epa_per_target decimal(5,2),
    rec_epa_per_reception decimal(5,2),
    rec_wpa_total decimal(5,2),
    rec_success_rate decimal(5,2),
    rec_air_yards int,
    rec_average_depth_of_target decimal(5,2),
    rec_yac_total int,
    rec_yac_per_game decimal(5,2),
    rec_yac_per_target decimal(5,2),
    rec_yac_per_reception decimal(5,2),
    rec_yac_percent decimal(5,2),
    rec_yac_epa_total decimal(5,2),
    rec_yac_epa_per_target decimal(5,2),
    rec_yac_epa_per_reception decimal(5,2),
    rec_yac_wpa_total decimal(5,2)


) AS $$
BEGIN
    RETURN QUERY
    WITH player_totals AS (
        SELECT 
            pw.player_id,
            p.first_name,
            p.last_name,
            COALESCE(MAX(pw.position), 'UNK')::varchar(5) as position,
            
            -- Game aggregations
            COUNT(*)::int as games_played,
            
            -- Advanced receiving stats aggregation for your exact columns
            SUM(pw.rec_targets)::int as agg_rec_targets,
            SUM(pw.rec_receptions)::int as agg_rec_receptions,
            SUM(pw.rec_yards)::int as agg_rec_yards,
            SUM(pw.rec_epa_total) as agg_rec_epa_total,
            SUM(pw.rec_wpa_total) as agg_rec_wpa_total,
            SUM(pw.rec_success_total)::int as agg_rec_success_total,
            SUM(pw.rec_air_yards_total)::int as agg_rec_air_yards_total,
            SUM(pw.rec_yac_total)::int as agg_rec_yac_total,
            SUM(pw.rec_yac_epa_total) as agg_rec_yac_epa_total,
            SUM(pw.rec_yac_wpa_total) as agg_rec_yac_wpa_total
            
        FROM player_week pw
        JOIN players p ON pw.player_id = p.player_id
        JOIN weeks w ON pw.season = w.season AND pw.week = w.week
        WHERE (p_player_id IS NULL OR pw.player_id = p_player_id)
          AND (p_season_start IS NULL OR pw.season >= p_season_start)
          AND (p_season_end IS NULL OR pw.season <= p_season_end)
          AND (p_week_start IS NULL OR pw.week >= p_week_start)
          AND (p_week_end IS NULL OR pw.week <= p_week_end)
          AND (p_season_type IS NULL OR w.season_type = ANY(string_to_array(p_season_type, ',')))
        GROUP BY pw.player_id, p.first_name, p.last_name
        HAVING SUM(pw.rec_targets) > 0  -- Only include players with targets
    )
    SELECT 
        pt.player_id,
        CONCAT(pt.first_name, ' ', pt.last_name) as full_name,
        pt.position as "position",
        pt.games_played,
        
        -- Advanced receiving stats matching your exact columns
        ROUND(pt.agg_rec_epa_total, 2) as rec_epa_total,
        CASE WHEN pt.agg_rec_targets > 0 THEN ROUND(pt.agg_rec_epa_total::decimal / pt.agg_rec_targets, 2) ELSE 0 END as rec_epa_per_target,
        CASE WHEN pt.agg_rec_receptions > 0 THEN ROUND(pt.agg_rec_epa_total::decimal / pt.agg_rec_receptions, 2) ELSE 0 END as rec_epa_per_reception,
        ROUND(pt.agg_rec_wpa_total, 2) as rec_wpa_total,
        CASE WHEN pt.agg_rec_targets > 0 THEN ROUND(pt.agg_rec_success_total::decimal / pt.agg_rec_targets * 100, 2) ELSE 0 END as rec_success_rate,
        pt.agg_rec_air_yards_total as rec_air_yards,
        CASE WHEN pt.agg_rec_targets > 0 THEN ROUND(pt.agg_rec_air_yards_total::decimal / pt.agg_rec_targets, 2) ELSE 0 END as rec_average_depth_of_target,
        pt.agg_rec_yac_total as rec_yac_total,
        ROUND(pt.agg_rec_yac_total::decimal / pt.games_played, 2) as rec_yac_per_game,
        CASE WHEN pt.agg_rec_targets > 0 THEN ROUND(pt.agg_rec_yac_total::decimal / pt.agg_rec_targets, 2) ELSE 0 END as rec_yac_per_target,
        CASE WHEN pt.agg_rec_receptions > 0 THEN ROUND(pt.agg_rec_yac_total::decimal / pt.agg_rec_receptions, 2) ELSE 0 END as rec_yac_per_reception,
        CASE WHEN pt.agg_rec_yards > 0 THEN ROUND(pt.agg_rec_yac_total::decimal / pt.agg_rec_yards * 100, 2) ELSE 0 END as rec_yac_percent,
        ROUND(pt.agg_rec_yac_epa_total, 2) as rec_yac_epa_total,
        CASE WHEN pt.agg_rec_targets > 0 THEN ROUND(pt.agg_rec_yac_epa_total::decimal / pt.agg_rec_targets, 2) ELSE 0 END as rec_yac_epa_per_target,
        CASE WHEN pt.agg_rec_receptions > 0 THEN ROUND(pt.agg_rec_yac_epa_total::decimal / pt.agg_rec_receptions, 2) ELSE 0 END as rec_yac_epa_per_reception,
        ROUND(pt.agg_rec_yac_wpa_total, 2) as rec_yac_wpa_total

        
    FROM player_totals pt
    ORDER BY pt.agg_rec_epa_total DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PLAYER TOTAL STATS
-- Combined offensive production metrics
-- ============================================================================
CREATE OR REPLACE FUNCTION public.player_total_stats(
    p_player_id text DEFAULT NULL,
    p_season_start int DEFAULT NULL,
    p_season_end int DEFAULT NULL, 
    p_week_start int DEFAULT NULL,
    p_week_end int DEFAULT NULL,
    p_season_type text DEFAULT 'REG'
)
RETURNS TABLE (
    -- Player identification
    player_id varchar(32),
    full_name text,
    "position" varchar(5),
    games_played int,
    
    -- Game info
    record text,
    win_percentage decimal(4,2),
    
    -- Total/combined stats (customize these columns as needed)
    total_plays int,
    total_plays_per_game decimal(5,2),
    total_yards int,
    total_yards_per_game decimal(5,2),
    total_yards_per_play decimal(5,2),
    total_touchdowns int,
    total_first_downs int,
    total_turnovers int, 
    total_epa decimal(5,2),
    total_epa_per_game decimal(5,2),
    total_epa_per_play decimal(5,2),
    total_wpa decimal(5,2),
    total_success_rate decimal(5,2)
) AS $$
BEGIN
    RETURN QUERY
    WITH player_totals AS (
        SELECT 
            pw.player_id,
            p.first_name,
            p.last_name,
            COALESCE(MAX(pw.position), 'UNK')::varchar(5) as position,
            
            -- Game aggregations
            COUNT(*)::int as games_played,
            SUM(CASE WHEN pw.win THEN 1 ELSE 0 END)::int as wins,
            SUM(CASE WHEN pw.loss THEN 1 ELSE 0 END)::int as losses,
            SUM(CASE WHEN pw.tie THEN 1 ELSE 0 END)::int as ties,
            
            -- Total stats aggregation (calculated from individual stats)
            SUM(pw.pass_attempts + pw.rush_attempts + pw.rec_targets)::int as agg_total_plays,
            SUM(pw.pass_yards + pw.rush_yards + pw.rec_yards)::int as agg_total_yards,
            SUM(pw.pass_touchdowns + pw.rush_touchdowns + pw.rec_touchdowns)::int as agg_total_touchdowns,
            SUM(pw.pass_first_downs + pw.rush_first_downs + pw.rec_first_downs)::int as agg_total_first_downs,
            SUM(pw.pass_ints + pw.rush_fumbles_lost + pw.rec_fumbles_lost)::int as agg_total_turnovers,
            SUM(pw.pass_epa + pw.rush_epa_total + pw.rec_epa_total) as agg_total_epa,
            SUM(pw.pass_wpa + pw.rush_wpa_total + pw.rec_wpa_total) as agg_total_wpa,
            SUM(pw.pass_success_total + pw.rush_success_total + pw.rec_success_total)::int as agg_total_success_plays
            
        FROM player_week pw
        JOIN players p ON pw.player_id = p.player_id
        JOIN weeks w ON pw.season = w.season AND pw.week = w.week
        WHERE (p_player_id IS NULL OR pw.player_id = p_player_id)
          AND (p_season_start IS NULL OR pw.season >= p_season_start)
          AND (p_season_end IS NULL OR pw.season <= p_season_end)
          AND (p_week_start IS NULL OR pw.week >= p_week_start)
          AND (p_week_end IS NULL OR pw.week <= p_week_end)
          AND (p_season_type IS NULL OR w.season_type = ANY(string_to_array(p_season_type, ',')))
        GROUP BY pw.player_id, p.first_name, p.last_name
        HAVING SUM(pw.total_plays) > 0  -- Include players with any offensive plays
    )
    SELECT 
        pt.player_id,
        CONCAT(pt.first_name, ' ', pt.last_name) as full_name,
        pt.position as "position",
        pt.games_played,
        CONCAT(pt.wins, '-', pt.losses, '-', pt.ties) as record,
        CASE WHEN pt.games_played > 0 THEN ROUND(pt.wins::decimal / pt.games_played * 100, 2) ELSE 0 END as win_percentage,
        
        -- Raw total stats matching your exact columns
        pt.agg_total_plays,
        ROUND(pt.agg_total_plays::decimal / pt.games_played, 2) as total_plays_per_game,
        pt.agg_total_yards,
        ROUND(pt.agg_total_yards::decimal / pt.games_played, 2) as total_yards_per_game,
        CASE WHEN pt.agg_total_plays > 0 THEN ROUND(pt.agg_total_yards::decimal / pt.agg_total_plays, 2) ELSE 0 END as total_yards_per_play,
        pt.agg_total_touchdowns,
        pt.agg_total_first_downs,
        pt.agg_total_turnovers,
        ROUND(pt.agg_total_epa, 2) as total_epa,
        ROUND(pt.agg_total_epa / pt.games_played, 2) as total_epa_per_game,
        CASE WHEN pt.agg_total_plays > 0 THEN ROUND(pt.agg_total_epa / pt.agg_total_plays, 2) ELSE 0 END as total_epa_per_play,
        ROUND(pt.agg_total_wpa, 2) as total_wpa,
        CASE WHEN pt.agg_total_plays > 0 THEN ROUND(pt.agg_total_success_plays::decimal / pt.agg_total_plays * 100, 2) ELSE 0 END as total_success_rate
        
    FROM player_totals pt
    ORDER BY pt.agg_total_yards DESC;
END;
$$ LANGUAGE plpgsql;

COMMIT;