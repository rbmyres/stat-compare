BEGIN;

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS public.player_stats(text, int, int, int, int, text);
DROP FUNCTION IF EXISTS public.team_stats(text, int, int, int, int, text);

-- Create player_stats function with ALL stats from v_player_week view
CREATE OR REPLACE FUNCTION public.player_stats(
    p_player_id text DEFAULT NULL,
    p_season_start int DEFAULT NULL,
    p_season_end int DEFAULT NULL, 
    p_week_start int DEFAULT NULL,
    p_week_end int DEFAULT NULL,
    p_season_type text DEFAULT 'REG'
)
RETURNS TABLE (
    -- Base info (aggregated data, not individual games)
    player_id varchar(32),
    first_name text,
    last_name text,
    first_season int,
    last_season int,
    
    -- Win/Loss record
    games_played int,
    record text,
    win_percentage decimal(5,3),
    
    -- Raw passing stats (aggregated totals)
    pass_attempts int,
    pass_completions int,
    pass_yards int,
    pass_touchdowns int,
    pass_ints int,
    pass_sacks int,
    pass_sack_yards int,
    pass_air_yards int,
    pass_qb_hit int,
    pass_qb_dropbacks int,
    pass_first_downs int,
    pass_yac_total int,
    pass_epa decimal(8,4),
    pass_wpa decimal(8,4),
    pass_cpoe_total decimal(8,4),
    pass_success_total int,
    pass_20_plus int,
    pass_long int,
    pass_yac_epa_total decimal(8,4),
    pass_yac_wpa_total decimal(8,4),
    
    -- Calculated passing stats (from aggregated totals)
    pass_comp_percent decimal(5,1),
    pass_yards_per_attempt decimal(5,2),
    pass_yards_per_completion decimal(5,2),
    pass_air_yards_per_attempt decimal(5,2),
    pass_air_yards_per_completion decimal(5,2),
    pass_yac_per_attempt decimal(5,2),
    pass_yac_per_completion decimal(5,2),
    pass_td_percent decimal(5,2),
    pass_int_percent decimal(5,2),
    pass_sack_percent decimal(5,2),
    pass_qb_hit_percent decimal(5,2),
    pass_cpoe decimal(6,3),
    pass_success_rate decimal(5,1),
    pass_20_plus_rate decimal(5,2),
    pass_first_down_rate decimal(5,2),
    pass_yards_per_game decimal(8,1),
    pass_average_depth_of_target decimal(5,1),
    pass_epa_per_attempt decimal(6,3),
    pass_epa_per_completion decimal(6,3),
    pass_epa_per_dropback decimal(6,3),
    pass_wpa_per_attempt decimal(7,4),
    pass_wpa_per_completion decimal(7,4),
    pass_wpa_per_dropback decimal(7,4),
    pass_yac_epa_per_attempt decimal(6,3),
    pass_yac_epa_per_completion decimal(6,3),
    pass_yac_epa_per_dropback decimal(6,3),
    pass_yac_wpa_per_attempt decimal(7,4),
    pass_yac_wpa_per_completion decimal(7,4),
    pass_yac_wpa_per_dropback decimal(7,4),
    pass_rating decimal(5,1),
    
    -- Raw rushing stats (aggregated totals)
    rush_attempts int,
    rush_yards int,
    rush_touchdowns int,
    rush_long int,
    rush_stuffs int,
    rush_10_plus int,
    rush_20_plus int,
    rush_first_downs int,
    rush_epa_total decimal(8,4),
    rush_wpa_total decimal(8,4),
    rush_success_total int,
    qb_scramble_attempts int,
    qb_scramble_yards int,
    qb_scramble_epa_total decimal(8,4),
    qb_scramble_tds int,
    qb_scramble_wpa_total decimal(8,4),
    qb_scramble_success_total int,
    rush_fumbles int,
    rush_fumbles_lost int,
    
    -- Calculated rushing stats (from aggregated totals)
    rush_yards_per_carry decimal(5,2),
    rush_touchdown_rate decimal(5,2),
    rush_stuff_rate decimal(5,2),
    rush_10_plus_rate decimal(5,2),
    rush_20_plus_rate decimal(5,2),
    rush_yards_per_game decimal(8,1),
    rush_epa_per_attempt decimal(6,3),
    rush_success_rate decimal(5,1),
    rush_wpa_per_attempt decimal(7,4),
    qb_scramble_yards_per_carry decimal(5,2),
    qb_scramble_epa_per_carry decimal(6,3),
    qb_scramble_wpa_per_carry decimal(7,4),
    qb_scramble_yards_per_game decimal(8,1),
    qb_scramble_success_rate decimal(5,1),
    
    -- Raw receiving stats (aggregated totals)
    rec_targets int,
    rec_receptions int,
    rec_yards int,
    rec_touchdowns int,
    rec_air_yards_total int,
    rec_yac_total int,
    rec_first_downs int,
    rec_epa_total decimal(8,4),
    rec_wpa_total decimal(8,4),
    rec_success_total int,
    rec_yac_epa_total decimal(8,4),
    rec_yac_wpa_total decimal(8,4),
    rec_20_plus int,
    rec_long int,
    rec_fumbles int,
    rec_fumbles_lost int,
    
    -- Calculated receiving stats (from aggregated totals)
    rec_catch_rate decimal(5,1),
    rec_yards_per_reception decimal(5,2),
    rec_yards_per_target decimal(5,2),
    rec_touchdown_rate decimal(5,2),
    rec_air_yards_per_target decimal(5,2),
    rec_air_yards_per_reception decimal(5,2),
    rec_yac_per_reception decimal(5,2),
    rec_air_yard_percent decimal(5,1),
    rec_yac_percent decimal(5,1),
    rec_first_down_rate decimal(5,2),
    rec_epa_per_target decimal(6,3),
    rec_epa_per_reception decimal(6,3),
    rec_wpa_per_target decimal(7,4),
    rec_wpa_per_reception decimal(7,4),
    rec_success_rate decimal(5,1),
    rec_yac_epa_per_target decimal(6,3),
    rec_yac_epa_per_reception decimal(6,3),
    rec_yac_wpa_per_target decimal(7,4),
    rec_yac_wpa_per_reception decimal(7,4),
    rec_20_plus_rate decimal(5,2),
    rec_yards_per_game decimal(8,1),
    
    -- Raw total stats (aggregated totals)
    total_yards int,
    total_plays int,
    total_touchdowns int,
    total_epa decimal(8,4),
    total_wpa decimal(8,4),
    total_first_downs int,
    total_success_plays int,
    total_fumbles int,
    total_fumbles_lost int,
    scrim_yards int,
    scrim_touches int,
    scrim_touchdowns int,
    scrim_epa_total decimal(8,4),
    scrim_wpa_total decimal(8,4),
    scrim_first_downs int,
    scrim_success_total int,
    
    -- Calculated total stats (from aggregated totals)
    total_yards_per_play decimal(5,2),
    total_yards_per_game decimal(8,1),
    total_epa_per_play decimal(6,3),
    total_wpa_per_play decimal(7,4),
    total_success_rate decimal(5,1),
    scrim_yards_per_touch decimal(5,2),
    scrim_yards_per_game decimal(8,1),
    scrim_epa_per_play decimal(6,3),
    scrim_wpa_per_play decimal(7,4),
    scrim_success_rate decimal(5,1),
    
    -- Fantasy points (calculated from aggregated totals)
    ppr_points decimal(8,2)
) AS $$
DECLARE
    v_season_types text[];
BEGIN
    -- Validate and parse season_type parameter
    IF p_season_type IS NOT NULL THEN
        v_season_types := string_to_array(p_season_type, ',');
        -- Validate each season type
        IF NOT (v_season_types <@ ARRAY['REG', 'POST']) THEN
            RAISE EXCEPTION 'Invalid season_type. Allowed values: REG, POST';
        END IF;
    END IF;

    RETURN QUERY
    WITH player_totals AS (
        SELECT
            pw.player_id,
            p.first_name,
            p.last_name,
            p.first_season,
            p.last_season,

            -- Aggregate all raw stats across the date range (with COALESCE for NULL safety)
            COALESCE(SUM(pw.pass_attempts), 0)::int as agg_pass_attempts,
            COALESCE(SUM(pw.pass_completions), 0)::int as agg_pass_completions,
            COALESCE(SUM(pw.pass_yards), 0)::int as agg_pass_yards,
            COALESCE(SUM(pw.pass_touchdowns), 0)::int as agg_pass_touchdowns,
            COALESCE(SUM(pw.pass_ints), 0)::int as agg_pass_ints,
            COALESCE(SUM(pw.pass_sacks), 0)::int as agg_pass_sacks,
            COALESCE(SUM(pw.pass_sack_yards), 0)::int as agg_pass_sack_yards,
            COALESCE(SUM(pw.pass_air_yards), 0)::int as agg_pass_air_yards,
            COALESCE(SUM(pw.pass_qb_hits), 0)::int as agg_pass_qb_hit,
            COALESCE(SUM(pw.pass_qb_dropbacks), 0)::int as agg_pass_qb_dropbacks,
            COALESCE(SUM(pw.pass_first_downs), 0)::int as agg_pass_first_downs,
            COALESCE(SUM(pw.pass_yac_total), 0)::int as agg_pass_yac_total,
            COALESCE(SUM(pw.pass_epa), 0) as agg_pass_epa,
            COALESCE(SUM(pw.pass_wpa), 0) as agg_pass_wpa,
            COALESCE(SUM(pw.pass_cpoe_total), 0) as agg_pass_cpoe_total,
            COALESCE(SUM(pw.pass_success_total), 0)::int as agg_pass_success_total,
            COALESCE(SUM(pw.pass_20_plus), 0)::int as agg_pass_20_plus,
            COALESCE(MAX(pw.pass_long), 0)::int as agg_pass_long,
            COALESCE(SUM(pw.pass_yac_epa_total), 0) as agg_pass_yac_epa_total,
            COALESCE(SUM(pw.pass_yac_wpa_total), 0) as agg_pass_yac_wpa_total,

            COALESCE(SUM(pw.rush_attempts), 0)::int as agg_rush_attempts,
            COALESCE(SUM(pw.rush_yards), 0)::int as agg_rush_yards,
            COALESCE(SUM(pw.rush_touchdowns), 0)::int as agg_rush_touchdowns,
            COALESCE(MAX(pw.rush_long), 0)::int as agg_rush_long,
            COALESCE(SUM(pw.rush_stuffs), 0)::int as agg_rush_stuffs,
            COALESCE(SUM(pw.rush_10_plus), 0)::int as agg_rush_10_plus,
            COALESCE(SUM(pw.rush_20_plus), 0)::int as agg_rush_20_plus,
            COALESCE(SUM(pw.rush_first_downs), 0)::int as agg_rush_first_downs,
            COALESCE(SUM(pw.rush_epa_total), 0) as agg_rush_epa_total,
            COALESCE(SUM(pw.rush_wpa_total), 0) as agg_rush_wpa_total,
            COALESCE(SUM(pw.rush_success_total), 0)::int as agg_rush_success_total,
            COALESCE(SUM(pw.qb_scramble_attempts), 0)::int as agg_qb_scramble_attempts,
            COALESCE(SUM(pw.qb_scramble_yards), 0)::int as agg_qb_scramble_yards,
            COALESCE(SUM(pw.qb_scramble_epa_total), 0) as agg_qb_scramble_epa_total,
            COALESCE(SUM(pw.qb_scramble_touchdowns), 0)::int as agg_qb_scramble_tds,
            COALESCE(SUM(pw.qb_scramble_wpa_total), 0) as agg_qb_scramble_wpa_total,
            COALESCE(SUM(pw.qb_scramble_success_total), 0)::int as agg_qb_scramble_success_total,
            COALESCE(SUM(pw.rush_fumbles), 0)::int as agg_rush_fumbles,
            COALESCE(SUM(pw.rush_fumbles_lost), 0)::int as agg_rush_fumbles_lost,

            COALESCE(SUM(pw.rec_targets), 0)::int as agg_rec_targets,
            COALESCE(SUM(pw.rec_receptions), 0)::int as agg_rec_receptions,
            COALESCE(SUM(pw.rec_yards), 0)::int as agg_rec_yards,
            COALESCE(SUM(pw.rec_touchdowns), 0)::int as agg_rec_touchdowns,
            COALESCE(SUM(pw.rec_air_yards_total), 0)::int as agg_rec_air_yards_total,
            COALESCE(SUM(pw.rec_yac_total), 0)::int as agg_rec_yac_total,
            COALESCE(SUM(pw.rec_first_downs), 0)::int as agg_rec_first_downs,
            COALESCE(SUM(pw.rec_epa_total), 0) as agg_rec_epa_total,
            COALESCE(SUM(pw.rec_wpa_total), 0) as agg_rec_wpa_total,
            COALESCE(SUM(pw.rec_success_total), 0)::int as agg_rec_success_total,
            COALESCE(SUM(pw.rec_yac_epa_total), 0) as agg_rec_yac_epa_total,
            COALESCE(SUM(pw.rec_yac_wpa_total), 0) as agg_rec_yac_wpa_total,
            COALESCE(SUM(pw.rec_20_plus), 0)::int as agg_rec_20_plus,
            COALESCE(MAX(pw.rec_long), 0)::int as agg_rec_long,
            COALESCE(SUM(pw.rec_fumbles), 0)::int as agg_rec_fumbles,
            COALESCE(SUM(pw.rec_fumbles_lost), 0)::int as agg_rec_fumbles_lost,

            COALESCE(SUM(pw.total_yards), 0)::int as agg_total_yards,
            COALESCE(SUM(pw.total_plays), 0)::int as agg_total_plays,
            COALESCE(SUM(pw.total_touchdowns), 0)::int as agg_total_touchdowns,
            COALESCE(SUM(pw.total_epa), 0) as agg_total_epa,
            COALESCE(SUM(pw.total_wpa), 0) as agg_total_wpa,
            COALESCE(SUM(pw.total_first_downs), 0)::int as agg_total_first_downs,
            COALESCE(SUM(pw.total_success_plays), 0)::int as agg_total_success_plays,
            COALESCE(SUM(pw.total_fumbles), 0)::int as agg_total_fumbles,
            COALESCE(SUM(pw.total_fumbles_lost), 0)::int as agg_total_fumbles_lost,
            COALESCE(SUM(pw.scrim_yards), 0)::int as agg_scrim_yards,
            COALESCE(SUM(pw.scrim_touches), 0)::int as agg_scrim_touches,
            COALESCE(SUM(pw.scrim_touchdowns), 0)::int as agg_scrim_touchdowns,
            COALESCE(SUM(pw.scrim_epa_total), 0) as agg_scrim_epa_total,
            COALESCE(SUM(pw.scrim_wpa_total), 0) as agg_scrim_wpa_total,
            COALESCE(SUM(pw.scrim_first_downs), 0)::int as agg_scrim_first_downs,
            COALESCE(SUM(pw.scrim_success_total), 0)::int as agg_scrim_success_total,

            -- Win/Loss aggregations
            COUNT(*)::int as games_played,
            COALESCE(SUM(pw.win::int), 0)::int as wins,
            COALESCE(SUM(pw.loss::int), 0)::int as losses,
            COALESCE(SUM(pw.tie::int), 0)::int as ties

        FROM player_week pw
        JOIN players p ON pw.player_id = p.player_id
        JOIN weeks w ON pw.season = w.season AND pw.week = w.week
        WHERE (p_player_id IS NULL OR pw.player_id = p_player_id)
          AND (p_season_start IS NULL OR pw.season >= p_season_start)
          AND (p_season_end IS NULL OR pw.season <= p_season_end)
          AND (p_week_start IS NULL OR pw.week >= p_week_start)
          AND (p_week_end IS NULL OR pw.week <= p_week_end)
          AND (p_season_type IS NULL OR w.season_type = ANY(v_season_types))
        GROUP BY pw.player_id, p.first_name, p.last_name, p.first_season, p.last_season
    )
    SELECT 
        pt.player_id,
        pt.first_name,
        pt.last_name,
        pt.first_season,
        pt.last_season,
        
        -- Win/Loss record
        pt.games_played,
        CONCAT(pt.wins, '-', pt.losses, '-', pt.ties) as record,
        CASE WHEN pt.games_played > 0 THEN ROUND(pt.wins::decimal / pt.games_played, 3) ELSE 0 END,
        
        -- Raw passing stats (aggregated)
        pt.agg_pass_attempts,
        pt.agg_pass_completions,
        pt.agg_pass_yards,
        pt.agg_pass_touchdowns,
        pt.agg_pass_ints,
        pt.agg_pass_sacks,
        pt.agg_pass_sack_yards,
        pt.agg_pass_air_yards,
        pt.agg_pass_qb_hit,
        pt.agg_pass_qb_dropbacks,
        pt.agg_pass_first_downs,
        pt.agg_pass_yac_total,
        pt.agg_pass_epa,
        pt.agg_pass_wpa,
        pt.agg_pass_cpoe_total,
        pt.agg_pass_success_total,
        pt.agg_pass_20_plus,
        pt.agg_pass_long,
        pt.agg_pass_yac_epa_total,
        pt.agg_pass_yac_wpa_total,
        
        -- Calculated passing stats (from aggregated totals - CORRECT!)
        CASE WHEN pt.agg_pass_attempts > 0 THEN ROUND(pt.agg_pass_completions::decimal / pt.agg_pass_attempts * 100, 1) ELSE 0 END,
        CASE WHEN pt.agg_pass_attempts > 0 THEN ROUND(pt.agg_pass_yards::decimal / pt.agg_pass_attempts, 2) ELSE 0 END,
        CASE WHEN pt.agg_pass_completions > 0 THEN ROUND(pt.agg_pass_yards::decimal / pt.agg_pass_completions, 2) ELSE 0 END,
        CASE WHEN pt.agg_pass_attempts > 0 THEN ROUND(pt.agg_pass_air_yards::decimal / pt.agg_pass_attempts, 2) ELSE 0 END,
        CASE WHEN pt.agg_pass_completions > 0 THEN ROUND(pt.agg_pass_air_yards::decimal / pt.agg_pass_completions, 2) ELSE 0 END,
        CASE WHEN pt.agg_pass_attempts > 0 THEN ROUND(pt.agg_pass_yac_total::decimal / pt.agg_pass_attempts, 2) ELSE 0 END,
        CASE WHEN pt.agg_pass_completions > 0 THEN ROUND(pt.agg_pass_yac_total::decimal / pt.agg_pass_completions, 2) ELSE 0 END,
        CASE WHEN pt.agg_pass_attempts > 0 THEN ROUND(pt.agg_pass_touchdowns::decimal / pt.agg_pass_attempts * 100, 2) ELSE 0 END,
        CASE WHEN pt.agg_pass_attempts > 0 THEN ROUND(pt.agg_pass_ints::decimal / pt.agg_pass_attempts * 100, 2) ELSE 0 END,
        CASE WHEN pt.agg_pass_qb_dropbacks > 0 THEN ROUND(pt.agg_pass_sacks::decimal / pt.agg_pass_qb_dropbacks * 100, 2) ELSE 0 END,
        CASE WHEN pt.agg_pass_qb_dropbacks > 0 THEN ROUND(pt.agg_pass_qb_hit::decimal / pt.agg_pass_qb_dropbacks * 100, 2) ELSE 0 END,
        CASE WHEN pt.agg_pass_attempts > 0 THEN ROUND(pt.agg_pass_cpoe_total::decimal / pt.agg_pass_attempts, 3) ELSE 0 END,
        CASE WHEN pt.agg_pass_attempts > 0 THEN ROUND(pt.agg_pass_success_total::decimal / pt.agg_pass_attempts * 100, 1) ELSE 0 END,
        CASE WHEN pt.agg_pass_attempts > 0 THEN ROUND(pt.agg_pass_20_plus::decimal / pt.agg_pass_attempts * 100, 2) ELSE 0 END,
        CASE WHEN pt.agg_pass_attempts > 0 THEN ROUND(pt.agg_pass_first_downs::decimal / pt.agg_pass_attempts * 100, 2) ELSE 0 END,
        CASE WHEN pt.games_played > 0 THEN ROUND(pt.agg_pass_yards::decimal / pt.games_played, 1) ELSE 0 END,
        CASE WHEN pt.agg_pass_attempts > 0 THEN ROUND(pt.agg_pass_air_yards::decimal / pt.agg_pass_attempts, 1) ELSE 0 END,
        CASE WHEN pt.agg_pass_attempts > 0 THEN ROUND(pt.agg_pass_epa::decimal / pt.agg_pass_attempts, 3) ELSE 0 END,
        CASE WHEN pt.agg_pass_completions > 0 THEN ROUND(pt.agg_pass_epa::decimal / pt.agg_pass_completions, 3) ELSE 0 END,
        CASE WHEN pt.agg_pass_qb_dropbacks > 0 THEN ROUND(pt.agg_pass_epa::decimal / pt.agg_pass_qb_dropbacks, 3) ELSE 0 END,
        CASE WHEN pt.agg_pass_attempts > 0 THEN ROUND(pt.agg_pass_wpa::decimal / pt.agg_pass_attempts, 4) ELSE 0 END,
        CASE WHEN pt.agg_pass_completions > 0 THEN ROUND(pt.agg_pass_wpa::decimal / pt.agg_pass_completions, 4) ELSE 0 END,
        CASE WHEN pt.agg_pass_qb_dropbacks > 0 THEN ROUND(pt.agg_pass_wpa::decimal / pt.agg_pass_qb_dropbacks, 4) ELSE 0 END,
        CASE WHEN pt.agg_pass_attempts > 0 THEN ROUND(pt.agg_pass_yac_epa_total::decimal / pt.agg_pass_attempts, 3) ELSE 0 END,
        CASE WHEN pt.agg_pass_completions > 0 THEN ROUND(pt.agg_pass_yac_epa_total::decimal / pt.agg_pass_completions, 3) ELSE 0 END,
        CASE WHEN pt.agg_pass_qb_dropbacks > 0 THEN ROUND(pt.agg_pass_yac_epa_total::decimal / pt.agg_pass_qb_dropbacks, 3) ELSE 0 END,
        CASE WHEN pt.agg_pass_attempts > 0 THEN ROUND(pt.agg_pass_yac_wpa_total::decimal / pt.agg_pass_attempts, 4) ELSE 0 END,
        CASE WHEN pt.agg_pass_completions > 0 THEN ROUND(pt.agg_pass_yac_wpa_total::decimal / pt.agg_pass_completions, 4) ELSE 0 END,
        CASE WHEN pt.agg_pass_qb_dropbacks > 0 THEN ROUND(pt.agg_pass_yac_wpa_total::decimal / pt.agg_pass_qb_dropbacks, 4) ELSE 0 END,
        CASE 
            WHEN pt.agg_pass_attempts >= 1 THEN 
                GREATEST(0, LEAST(158.3, ROUND(
                    ((pt.agg_pass_completions::decimal / pt.agg_pass_attempts - 0.3) * 5 + 
                     (pt.agg_pass_yards::decimal / pt.agg_pass_attempts - 3) * 0.25 + 
                     (pt.agg_pass_touchdowns::decimal / pt.agg_pass_attempts) * 20 + 
                     (2.375 - pt.agg_pass_ints::decimal / pt.agg_pass_attempts * 25)) / 6 * 100, 1)))
            ELSE 0 
        END,
        
        -- Raw rushing stats (aggregated)
        pt.agg_rush_attempts,
        pt.agg_rush_yards,
        pt.agg_rush_touchdowns,
        pt.agg_rush_long,
        pt.agg_rush_stuffs,
        pt.agg_rush_10_plus,
        pt.agg_rush_20_plus,
        pt.agg_rush_first_downs,
        pt.agg_rush_epa_total,
        pt.agg_rush_wpa_total,
        pt.agg_rush_success_total,
        pt.agg_qb_scramble_attempts,
        pt.agg_qb_scramble_yards,
        pt.agg_qb_scramble_epa_total,
        pt.agg_qb_scramble_tds,
        pt.agg_qb_scramble_wpa_total,
        pt.agg_qb_scramble_success_total,
        pt.agg_rush_fumbles,
        pt.agg_rush_fumbles_lost,
        
        -- Calculated rushing stats (from aggregated totals - CORRECT!)
        CASE WHEN pt.agg_rush_attempts > 0 THEN ROUND(pt.agg_rush_yards::decimal / pt.agg_rush_attempts, 2) ELSE 0 END,
        CASE WHEN pt.agg_rush_attempts > 0 THEN ROUND(pt.agg_rush_touchdowns::decimal / pt.agg_rush_attempts * 100, 2) ELSE 0 END,
        CASE WHEN pt.agg_rush_attempts > 0 THEN ROUND(pt.agg_rush_stuffs::decimal / pt.agg_rush_attempts * 100, 2) ELSE 0 END,
        CASE WHEN pt.agg_rush_attempts > 0 THEN ROUND(pt.agg_rush_10_plus::decimal / pt.agg_rush_attempts * 100, 2) ELSE 0 END,
        CASE WHEN pt.agg_rush_attempts > 0 THEN ROUND(pt.agg_rush_20_plus::decimal / pt.agg_rush_attempts * 100, 2) ELSE 0 END,
        CASE WHEN pt.games_played > 0 THEN ROUND(pt.agg_rush_yards::decimal / pt.games_played, 1) ELSE 0 END,
        CASE WHEN pt.agg_rush_attempts > 0 THEN ROUND(pt.agg_rush_epa_total::decimal / pt.agg_rush_attempts, 3) ELSE 0 END,
        CASE WHEN pt.agg_rush_attempts > 0 THEN ROUND(pt.agg_rush_success_total::decimal / pt.agg_rush_attempts * 100, 1) ELSE 0 END,
        CASE WHEN pt.agg_rush_attempts > 0 THEN ROUND(pt.agg_rush_wpa_total::decimal / pt.agg_rush_attempts, 4) ELSE 0 END,
        CASE WHEN pt.agg_qb_scramble_attempts > 0 THEN ROUND(pt.agg_qb_scramble_yards::decimal / pt.agg_qb_scramble_attempts, 2) ELSE 0 END,
        CASE WHEN pt.agg_qb_scramble_attempts > 0 THEN ROUND(pt.agg_qb_scramble_epa_total::decimal / pt.agg_qb_scramble_attempts, 3) ELSE 0 END,
        CASE WHEN pt.agg_qb_scramble_attempts > 0 THEN ROUND(pt.agg_qb_scramble_wpa_total::decimal / pt.agg_qb_scramble_attempts, 4) ELSE 0 END,
        CASE WHEN pt.games_played > 0 THEN ROUND(pt.agg_qb_scramble_yards::decimal / pt.games_played, 1) ELSE 0 END,
        CASE WHEN pt.agg_qb_scramble_attempts > 0 THEN ROUND(pt.agg_qb_scramble_success_total::decimal / pt.agg_qb_scramble_attempts * 100, 1) ELSE 0 END,
        
        -- Raw receiving stats (aggregated)
        pt.agg_rec_targets,
        pt.agg_rec_receptions,
        pt.agg_rec_yards,
        pt.agg_rec_touchdowns,
        pt.agg_rec_air_yards_total,
        pt.agg_rec_yac_total,
        pt.agg_rec_first_downs,
        pt.agg_rec_epa_total,
        pt.agg_rec_wpa_total,
        pt.agg_rec_success_total,
        pt.agg_rec_yac_epa_total,
        pt.agg_rec_yac_wpa_total,
        pt.agg_rec_20_plus,
        pt.agg_rec_long,
        pt.agg_rec_fumbles,
        pt.agg_rec_fumbles_lost,
        
        -- Calculated receiving stats (from aggregated totals - CORRECT!)
        CASE WHEN pt.agg_rec_targets > 0 THEN ROUND(pt.agg_rec_receptions::decimal / pt.agg_rec_targets * 100, 1) ELSE 0 END,
        CASE WHEN pt.agg_rec_receptions > 0 THEN ROUND(pt.agg_rec_yards::decimal / pt.agg_rec_receptions, 2) ELSE 0 END,
        CASE WHEN pt.agg_rec_targets > 0 THEN ROUND(pt.agg_rec_yards::decimal / pt.agg_rec_targets, 2) ELSE 0 END,
        CASE WHEN pt.agg_rec_receptions > 0 THEN ROUND(pt.agg_rec_touchdowns::decimal / pt.agg_rec_receptions * 100, 2) ELSE 0 END,
        CASE WHEN pt.agg_rec_targets > 0 THEN ROUND(pt.agg_rec_air_yards_total::decimal / pt.agg_rec_targets, 2) ELSE 0 END,
        CASE WHEN pt.agg_rec_receptions > 0 THEN ROUND(pt.agg_rec_air_yards_total::decimal / pt.agg_rec_receptions, 2) ELSE 0 END,
        CASE WHEN pt.agg_rec_receptions > 0 THEN ROUND(pt.agg_rec_yac_total::decimal / pt.agg_rec_receptions, 2) ELSE 0 END,
        CASE WHEN pt.agg_rec_yards > 0 THEN ROUND(pt.agg_rec_air_yards_total::decimal / pt.agg_rec_yards * 100, 1) ELSE 0 END,
        CASE WHEN pt.agg_rec_yards > 0 THEN ROUND(pt.agg_rec_yac_total::decimal / pt.agg_rec_yards * 100, 1) ELSE 0 END,
        CASE WHEN pt.agg_rec_receptions > 0 THEN ROUND(pt.agg_rec_first_downs::decimal / pt.agg_rec_receptions * 100, 2) ELSE 0 END,
        CASE WHEN pt.agg_rec_targets > 0 THEN ROUND(pt.agg_rec_epa_total::decimal / pt.agg_rec_targets, 3) ELSE 0 END,
        CASE WHEN pt.agg_rec_receptions > 0 THEN ROUND(pt.agg_rec_epa_total::decimal / pt.agg_rec_receptions, 3) ELSE 0 END,
        CASE WHEN pt.agg_rec_targets > 0 THEN ROUND(pt.agg_rec_wpa_total::decimal / pt.agg_rec_targets, 4) ELSE 0 END,
        CASE WHEN pt.agg_rec_receptions > 0 THEN ROUND(pt.agg_rec_wpa_total::decimal / pt.agg_rec_receptions, 4) ELSE 0 END,
        CASE WHEN pt.agg_rec_targets > 0 THEN ROUND(pt.agg_rec_success_total::decimal / pt.agg_rec_targets * 100, 1) ELSE 0 END,
        CASE WHEN pt.agg_rec_targets > 0 THEN ROUND(pt.agg_rec_yac_epa_total::decimal / pt.agg_rec_targets, 3) ELSE 0 END,
        CASE WHEN pt.agg_rec_receptions > 0 THEN ROUND(pt.agg_rec_yac_epa_total::decimal / pt.agg_rec_receptions, 3) ELSE 0 END,
        CASE WHEN pt.agg_rec_targets > 0 THEN ROUND(pt.agg_rec_yac_wpa_total::decimal / pt.agg_rec_targets, 4) ELSE 0 END,
        CASE WHEN pt.agg_rec_receptions > 0 THEN ROUND(pt.agg_rec_yac_wpa_total::decimal / pt.agg_rec_receptions, 4) ELSE 0 END,
        CASE WHEN pt.agg_rec_receptions > 0 THEN ROUND(pt.agg_rec_20_plus::decimal / pt.agg_rec_receptions * 100, 2) ELSE 0 END,
        CASE WHEN pt.games_played > 0 THEN ROUND(pt.agg_rec_yards::decimal / pt.games_played, 1) ELSE 0 END,
        
        -- Raw total stats (aggregated)
        pt.agg_total_yards,
        pt.agg_total_plays,
        pt.agg_total_touchdowns,
        pt.agg_total_epa,
        pt.agg_total_wpa,
        pt.agg_total_first_downs,
        pt.agg_total_success_plays,
        pt.agg_total_fumbles,
        pt.agg_total_fumbles_lost,
        pt.agg_scrim_yards,
        pt.agg_scrim_touches,
        pt.agg_scrim_touchdowns,
        pt.agg_scrim_epa_total,
        pt.agg_scrim_wpa_total,
        pt.agg_scrim_first_downs,
        pt.agg_scrim_success_total,
        
        -- Calculated total stats (from aggregated totals)
        CASE WHEN pt.agg_total_plays > 0 THEN ROUND(pt.agg_total_yards::decimal / pt.agg_total_plays, 2) ELSE 0 END,
        CASE WHEN pt.games_played > 0 THEN ROUND(pt.agg_total_yards::decimal / pt.games_played, 1) ELSE 0 END,
        CASE WHEN pt.agg_total_plays > 0 THEN ROUND(pt.agg_total_epa::decimal / pt.agg_total_plays, 3) ELSE 0 END,
        CASE WHEN pt.agg_total_plays > 0 THEN ROUND(pt.agg_total_wpa::decimal / pt.agg_total_plays, 4) ELSE 0 END,
        CASE WHEN pt.agg_total_plays > 0 THEN ROUND(pt.agg_total_success_plays::decimal / pt.agg_total_plays * 100, 1) ELSE 0 END,
        CASE WHEN pt.agg_scrim_touches > 0 THEN ROUND(pt.agg_scrim_yards::decimal / pt.agg_scrim_touches, 2) ELSE 0 END,
        CASE WHEN pt.games_played > 0 THEN ROUND(pt.agg_scrim_yards::decimal / pt.games_played, 1) ELSE 0 END,
        CASE WHEN pt.agg_scrim_touches > 0 THEN ROUND(pt.agg_scrim_epa_total::decimal / pt.agg_scrim_touches, 3) ELSE 0 END,
        CASE WHEN pt.agg_scrim_touches > 0 THEN ROUND(pt.agg_scrim_wpa_total::decimal / pt.agg_scrim_touches, 4) ELSE 0 END,
        CASE WHEN pt.agg_scrim_touches > 0 THEN ROUND(pt.agg_scrim_success_total::decimal / pt.agg_scrim_touches * 100, 1) ELSE 0 END,
        
        -- Fantasy points (calculated from aggregated totals - CORRECT!)
        (pt.agg_pass_yards * 0.04 + pt.agg_pass_touchdowns * 4 + pt.agg_pass_ints * -2 + 
         pt.agg_rush_yards * 0.1 + pt.agg_rush_touchdowns * 6 + 
         pt.agg_rec_receptions * 1 + pt.agg_rec_yards * 0.1 + pt.agg_rec_touchdowns * 6 +
         pt.agg_total_fumbles_lost * -2)
        
    FROM player_totals pt;
END;
$$ LANGUAGE plpgsql;

-- Create team_stats function with ALL stats from v_team_week view
CREATE OR REPLACE FUNCTION public.team_stats(
    p_team_id text DEFAULT NULL,
    p_season_start int DEFAULT NULL,
    p_season_end int DEFAULT NULL, 
    p_week_start int DEFAULT NULL,
    p_week_end int DEFAULT NULL,
    p_season_type text DEFAULT 'REG'
)
RETURNS TABLE (
    -- Base info
    team_id varchar(3),
    team_name text,
    team_abbr text,
    
    -- Win/Loss record
    games_played int,
    record text,
    win_percentage decimal(5,3),
    
    -- Raw offensive passing stats (aggregated totals)
    off_pass_attempts int,
    off_pass_yards int,
    off_pass_completions int,
    off_pass_touchdowns int,
    off_pass_ints int,
    off_pass_sacks int,
    off_pass_sack_yards int,
    off_pass_air_yards int,
    off_pass_qb_hit int,
    off_pass_first_downs int,
    off_pass_yac_total int,
    off_pass_epa decimal(8,4),
    off_pass_wpa decimal(8,4),
    off_pass_success_total int,
    off_pass_20_plus int,
    off_pass_dropbacks int,
    
    -- Calculated offensive passing stats
    off_pass_comp_percent decimal(5,1),
    off_pass_air_yards_per_attempt decimal(5,2),
    off_pass_air_yards_per_completion decimal(5,2),
    off_pass_yac_per_attempt decimal(5,2),
    off_pass_yac_per_completion decimal(5,2),
    off_pass_sack_percent decimal(5,2),
    off_pass_qb_hit_percent decimal(5,2),
    off_pass_success_rate decimal(5,1),
    off_pass_20_plus_rate decimal(5,2),
    off_pass_yards_per_game decimal(8,1),
    off_pass_average_depth_of_target decimal(5,1),
    off_pass_epa_per_attempt decimal(6,3),
    off_pass_epa_per_completion decimal(6,3),
    off_pass_epa_per_dropback decimal(6,3),
    off_pass_wpa_per_attempt decimal(7,4),
    off_pass_wpa_per_completion decimal(7,4),
    off_pass_wpa_per_dropback decimal(7,4),
    
    -- Raw offensive rushing stats (aggregated totals)
    off_rush_attempts int,
    off_rush_yards int,
    off_rush_touchdowns int,
    off_rush_stuffs int,
    off_rush_10_plus int,
    off_rush_20_plus int,
    off_rush_first_downs int,
    off_rush_epa_total decimal(8,4),
    off_rush_success_total int,
    off_rush_wpa_total decimal(8,4),
    
    -- Calculated offensive rushing stats
    off_rush_yards_per_carry decimal(5,2),
    off_rush_touchdown_rate decimal(5,2),
    off_rush_stuff_rate decimal(5,2),
    off_rush_10_plus_rate decimal(5,2),
    off_rush_20_plus_rate decimal(5,2),
    off_rush_yards_per_game decimal(8,1),
    off_rush_epa_per_attempt decimal(6,3),
    off_rush_success_rate decimal(5,1),
    off_rush_wpa_per_attempt decimal(7,4),
    
    -- Raw offensive total stats (aggregated totals)
    off_plays_total int,
    off_drives_total int,
    off_yards_total int,
    off_points_total int,
    off_first_downs int,
    off_touchdowns int,
    off_fumbles int,
    off_fumbles_lost int,
    off_turnovers int,
    off_epa decimal(8,4),
    off_wpa decimal(8,4),
    off_success_total int,
    off_explosive_plays int,
    
    -- Calculated offensive total stats
    off_yards_per_game decimal(8,1),
    off_yards_per_drive decimal(5,2),
    off_yards_per_play decimal(5,2),
    off_points_per_game decimal(8,1),
    off_points_per_drive decimal(5,2),
    off_points_per_play decimal(5,2),
    off_epa_per_game decimal(8,2),
    off_epa_per_drive decimal(6,3),
    off_epa_per_play decimal(6,3),
    off_wpa_per_game decimal(7,4),
    off_wpa_per_drive decimal(7,4),
    off_wpa_per_play decimal(7,4),
    off_success_rate decimal(5,1),
    off_explosive_play_rate decimal(5,2),
    
    -- Raw offensive situational stats (aggregated totals)
    off_third_down_attempts int,
    off_third_down_conversions int,
    off_fourth_down_attempts int,
    off_fourth_down_conversions int,
    off_three_and_outs int,
    off_early_down_epa decimal(8,4),
    off_early_down_success int,
    off_early_down_wpa decimal(8,4),
    off_late_down_epa decimal(8,4),
    off_late_down_success int,
    off_late_down_wpa decimal(8,4),
    off_early_down_total int,
    off_late_down_total int,
    
    -- Calculated offensive situational stats
    off_third_down_conversion_rate decimal(5,1),
    off_fourth_down_conversion_rate decimal(5,1),
    off_three_and_out_rate decimal(5,1),
    off_early_down_epa_per_play decimal(6,3),
    off_early_down_success_rate decimal(5,1),
    off_early_down_wpa_per_play decimal(7,4),
    off_late_down_epa_per_play decimal(6,3),
    off_late_down_success_rate decimal(5,1),
    off_late_down_wpa_per_play decimal(7,4),
    
    -- Raw defensive passing stats (aggregated totals)
    def_pass_attempts int,
    def_pass_yards int,
    def_pass_completions int,
    def_pass_touchdowns int,
    def_pass_ints int,
    def_pass_sacks int,
    def_pass_sack_yards int,
    def_pass_air_yards int,
    def_pass_qb_hit int,
    def_pass_first_downs int,
    def_pass_yac_total int,
    def_pass_epa decimal(8,4),
    def_pass_wpa decimal(8,4),
    def_pass_success_total int,
    def_pass_20_plus int,
    def_pass_dropbacks int,
    
    -- Calculated defensive passing stats
    def_pass_comp_percent decimal(5,1),
    def_pass_air_yards_per_attempt decimal(5,2),
    def_pass_air_yards_per_completion decimal(5,2),
    def_pass_yac_per_attempt decimal(5,2),
    def_pass_yac_per_completion decimal(5,2),
    def_pass_sack_percent decimal(5,2),
    def_pass_qb_hit_percent decimal(5,2),
    def_pass_success_rate decimal(5,1),
    def_pass_20_plus_rate decimal(5,2),
    def_pass_yards_per_game decimal(8,1),
    def_pass_average_depth_of_target decimal(5,1),
    def_pass_epa_per_attempt decimal(6,3),
    def_pass_epa_per_completion decimal(6,3),
    def_pass_epa_per_dropback decimal(6,3),
    def_pass_wpa_per_attempt decimal(7,4),
    def_pass_wpa_per_completion decimal(7,4),
    def_pass_wpa_per_dropback decimal(7,4),
    
    -- Raw defensive rushing stats (aggregated totals)
    def_rush_attempts int,
    def_rush_yards int,
    def_rush_touchdowns int,
    def_rush_stuffs int,
    def_rush_10_plus int,
    def_rush_20_plus int,
    def_rush_first_downs int,
    def_rush_epa_total decimal(8,4),
    def_rush_success_total int,
    def_rush_wpa_total decimal(8,4),
    
    -- Calculated defensive rushing stats
    def_rush_yards_per_carry decimal(5,2),
    def_rush_touchdown_rate decimal(5,2),
    def_rush_stuff_rate decimal(5,2),
    def_rush_10_plus_rate decimal(5,2),
    def_rush_20_plus_rate decimal(5,2),
    def_rush_yards_per_game decimal(8,1),
    def_rush_epa_per_attempt decimal(6,3),
    def_rush_success_rate decimal(5,1),
    def_rush_wpa_per_attempt decimal(7,4),
    
    -- Raw defensive total stats (aggregated totals)
    def_plays_total int,
    def_drives_total int,
    def_yards_total int,
    def_points_total int,
    def_first_downs int,
    def_touchdowns int,
    def_fumbles int,
    def_fumbles_lost int,
    def_turnovers int,
    def_epa decimal(8,4),
    def_wpa decimal(8,4),
    def_success_total int,
    def_explosive_plays int,
    
    -- Calculated defensive total stats
    def_yards_per_game decimal(8,1),
    def_yards_per_drive decimal(5,2),
    def_yards_per_play decimal(5,2),
    def_points_per_game decimal(8,1),
    def_points_per_drive decimal(5,2),
    def_points_per_play decimal(5,2),
    def_epa_per_game decimal(8,2),
    def_epa_per_drive decimal(6,3),
    def_epa_per_play decimal(6,3),
    def_wpa_per_game decimal(7,4),
    def_wpa_per_drive decimal(7,4),
    def_wpa_per_play decimal(7,4),
    def_success_rate decimal(5,1),
    def_explosive_play_rate decimal(5,2),
    
    -- Raw defensive situational stats (aggregated totals)
    def_third_down_attempts int,
    def_third_down_conversions int,
    def_fourth_down_attempts int,
    def_fourth_down_conversions int,
    def_three_and_outs int,
    def_early_down_epa decimal(8,4),
    def_early_down_success int,
    def_early_down_wpa decimal(8,4),
    def_late_down_epa decimal(8,4),
    def_late_down_success int,
    def_late_down_wpa decimal(8,4),
    def_early_down_total int,
    def_late_down_total int,
    
    -- Calculated defensive situational stats
    def_third_down_conversion_rate decimal(5,1),
    def_fourth_down_conversion_rate decimal(5,1),
    def_three_and_out_rate decimal(5,1),
    def_early_down_epa_per_play decimal(6,3),
    def_early_down_success_rate decimal(5,1),
    def_early_down_wpa_per_play decimal(7,4),
    def_late_down_epa_per_play decimal(6,3),
    def_late_down_success_rate decimal(5,1),
    def_late_down_wpa_per_play decimal(7,4)
) AS $$
DECLARE
    v_season_types text[];
BEGIN
    -- Validate and parse season_type parameter
    IF p_season_type IS NOT NULL THEN
        v_season_types := string_to_array(p_season_type, ',');
        -- Validate each season type
        IF NOT (v_season_types <@ ARRAY['REG', 'POST']) THEN
            RAISE EXCEPTION 'Invalid season_type. Allowed values: REG, POST';
        END IF;
    END IF;

    RETURN QUERY
    WITH team_totals AS (
        SELECT
            tw.team_id,
            t.display_name as team_name,
            t.abbr as team_abbr,

            -- Aggregate all raw offensive stats across the date range (with COALESCE for NULL safety)
            COALESCE(SUM(tw.off_pass_attempts), 0)::int as agg_off_pass_attempts,
            COALESCE(SUM(tw.off_pass_yards), 0)::int as agg_off_pass_yards,
            COALESCE(SUM(tw.off_pass_completions), 0)::int as agg_off_pass_completions,
            COALESCE(SUM(tw.off_pass_touchdowns), 0)::int as agg_off_pass_touchdowns,
            COALESCE(SUM(tw.off_pass_ints), 0)::int as agg_off_pass_ints,
            COALESCE(SUM(tw.off_pass_sacks), 0)::int as agg_off_pass_sacks,
            COALESCE(SUM(tw.off_pass_sack_yards), 0)::int as agg_off_pass_sack_yards,
            COALESCE(SUM(tw.off_pass_air_yards), 0)::int as agg_off_pass_air_yards,
            COALESCE(SUM(tw.off_pass_qb_hit), 0)::int as agg_off_pass_qb_hit,
            COALESCE(SUM(tw.off_pass_first_downs), 0)::int as agg_off_pass_first_downs,
            COALESCE(SUM(tw.off_pass_yac_total), 0)::int as agg_off_pass_yac_total,
            COALESCE(SUM(tw.off_pass_epa), 0) as agg_off_pass_epa,
            COALESCE(SUM(tw.off_pass_wpa), 0) as agg_off_pass_wpa,
            COALESCE(SUM(tw.off_pass_success_total), 0)::int as agg_off_pass_success_total,
            COALESCE(SUM(tw.off_pass_20_plus), 0)::int as agg_off_pass_20_plus,
            COALESCE(SUM(tw.off_pass_dropbacks), 0)::int as agg_off_pass_dropbacks,

            COALESCE(SUM(tw.off_rush_attempts), 0)::int as agg_off_rush_attempts,
            COALESCE(SUM(tw.off_rush_yards), 0)::int as agg_off_rush_yards,
            COALESCE(SUM(tw.off_rush_touchdowns), 0)::int as agg_off_rush_touchdowns,
            COALESCE(SUM(tw.off_rush_stuffs), 0)::int as agg_off_rush_stuffs,
            COALESCE(SUM(tw.off_rush_10_plus), 0)::int as agg_off_rush_10_plus,
            COALESCE(SUM(tw.off_rush_20_plus), 0)::int as agg_off_rush_20_plus,
            COALESCE(SUM(tw.off_rush_first_downs), 0)::int as agg_off_rush_first_downs,
            COALESCE(SUM(tw.off_rush_epa_total), 0) as agg_off_rush_epa_total,
            COALESCE(SUM(tw.off_rush_success_total), 0)::int as agg_off_rush_success_total,
            COALESCE(SUM(tw.off_rush_wpa_total), 0) as agg_off_rush_wpa_total,

            COALESCE(SUM(tw.off_plays_total), 0)::int as agg_off_plays_total,
            COALESCE(SUM(tw.off_drives_total), 0)::int as agg_off_drives_total,
            COALESCE(SUM(tw.off_yards_total), 0)::int as agg_off_yards_total,
            COALESCE(SUM(tw.off_points_total), 0)::int as agg_off_points_total,
            COALESCE(SUM(tw.off_first_downs), 0)::int as agg_off_first_downs,
            COALESCE(SUM(tw.off_touchdowns), 0)::int as agg_off_touchdowns,
            COALESCE(SUM(tw.off_fumbles), 0)::int as agg_off_fumbles,
            COALESCE(SUM(tw.off_fumbles_lost), 0)::int as agg_off_fumbles_lost,
            COALESCE(SUM(tw.off_turnovers), 0)::int as agg_off_turnovers,
            COALESCE(SUM(tw.off_epa), 0) as agg_off_epa,
            COALESCE(SUM(tw.off_wpa), 0) as agg_off_wpa,
            COALESCE(SUM(tw.off_success_total), 0)::int as agg_off_success_total,
            COALESCE(SUM(tw.off_explosive_plays), 0)::int as agg_off_explosive_plays,

            COALESCE(SUM(tw.off_third_down_attempts), 0)::int as agg_off_third_down_attempts,
            COALESCE(SUM(tw.off_third_down_conversions), 0)::int as agg_off_third_down_conversions,
            COALESCE(SUM(tw.off_fourth_down_attempts), 0)::int as agg_off_fourth_down_attempts,
            COALESCE(SUM(tw.off_fourth_down_conversions), 0)::int as agg_off_fourth_down_conversions,
            COALESCE(SUM(tw.off_three_and_outs), 0)::int as agg_off_three_and_outs,
            COALESCE(SUM(tw.off_early_down_epa), 0) as agg_off_early_down_epa,
            COALESCE(SUM(tw.off_early_down_success), 0)::int as agg_off_early_down_success,
            COALESCE(SUM(tw.off_early_down_wpa), 0) as agg_off_early_down_wpa,
            COALESCE(SUM(tw.off_late_down_epa), 0) as agg_off_late_down_epa,
            COALESCE(SUM(tw.off_late_down_success), 0)::int as agg_off_late_down_success,
            COALESCE(SUM(tw.off_late_down_wpa), 0) as agg_off_late_down_wpa,
            COALESCE(SUM(tw.off_early_down_total), 0)::int as agg_off_early_down_total,
            COALESCE(SUM(tw.off_late_down_total), 0)::int as agg_off_late_down_total,

            -- Aggregate all raw defensive stats across the date range (with COALESCE for NULL safety)
            COALESCE(SUM(tw.def_pass_attempts), 0)::int as agg_def_pass_attempts,
            COALESCE(SUM(tw.def_pass_yards), 0)::int as agg_def_pass_yards,
            COALESCE(SUM(tw.def_pass_completions), 0)::int as agg_def_pass_completions,
            COALESCE(SUM(tw.def_pass_touchdowns), 0)::int as agg_def_pass_touchdowns,
            COALESCE(SUM(tw.def_pass_ints), 0)::int as agg_def_pass_ints,
            COALESCE(SUM(tw.def_pass_sacks), 0)::int as agg_def_pass_sacks,
            COALESCE(SUM(tw.def_pass_sack_yards), 0)::int as agg_def_pass_sack_yards,
            COALESCE(SUM(tw.def_pass_air_yards), 0)::int as agg_def_pass_air_yards,
            COALESCE(SUM(tw.def_pass_qb_hit), 0)::int as agg_def_pass_qb_hit,
            COALESCE(SUM(tw.def_pass_first_downs), 0)::int as agg_def_pass_first_downs,
            COALESCE(SUM(tw.def_pass_yac_total), 0)::int as agg_def_pass_yac_total,
            COALESCE(SUM(tw.def_pass_epa), 0) as agg_def_pass_epa,
            COALESCE(SUM(tw.def_pass_wpa), 0) as agg_def_pass_wpa,
            COALESCE(SUM(tw.def_pass_success_total), 0)::int as agg_def_pass_success_total,
            COALESCE(SUM(tw.def_pass_20_plus), 0)::int as agg_def_pass_20_plus,
            COALESCE(SUM(tw.def_pass_dropbacks), 0)::int as agg_def_pass_dropbacks,

            COALESCE(SUM(tw.def_rush_attempts), 0)::int as agg_def_rush_attempts,
            COALESCE(SUM(tw.def_rush_yards), 0)::int as agg_def_rush_yards,
            COALESCE(SUM(tw.def_rush_touchdowns), 0)::int as agg_def_rush_touchdowns,
            COALESCE(SUM(tw.def_rush_stuffs), 0)::int as agg_def_rush_stuffs,
            COALESCE(SUM(tw.def_rush_10_plus), 0)::int as agg_def_rush_10_plus,
            COALESCE(SUM(tw.def_rush_20_plus), 0)::int as agg_def_rush_20_plus,
            COALESCE(SUM(tw.def_rush_first_downs), 0)::int as agg_def_rush_first_downs,
            COALESCE(SUM(tw.def_rush_epa_total), 0) as agg_def_rush_epa_total,
            COALESCE(SUM(tw.def_rush_success_total), 0)::int as agg_def_rush_success_total,
            COALESCE(SUM(tw.def_rush_wpa_total), 0) as agg_def_rush_wpa_total,

            COALESCE(SUM(tw.def_plays_total), 0)::int as agg_def_plays_total,
            COALESCE(SUM(tw.def_drives_total), 0)::int as agg_def_drives_total,
            COALESCE(SUM(tw.def_yards_total), 0)::int as agg_def_yards_total,
            COALESCE(SUM(tw.def_points_total), 0)::int as agg_def_points_total,
            COALESCE(SUM(tw.def_first_downs), 0)::int as agg_def_first_downs,
            COALESCE(SUM(tw.def_touchdowns), 0)::int as agg_def_touchdowns,
            COALESCE(SUM(tw.def_fumbles), 0)::int as agg_def_fumbles,
            COALESCE(SUM(tw.def_fumbles_lost), 0)::int as agg_def_fumbles_lost,
            COALESCE(SUM(tw.def_turnovers), 0)::int as agg_def_turnovers,
            COALESCE(SUM(tw.def_epa), 0) as agg_def_epa,
            COALESCE(SUM(tw.def_wpa), 0) as agg_def_wpa,
            COALESCE(SUM(tw.def_success_total), 0)::int as agg_def_success_total,
            COALESCE(SUM(tw.def_explosive_plays), 0)::int as agg_def_explosive_plays,

            COALESCE(SUM(tw.def_third_down_attempts), 0)::int as agg_def_third_down_attempts,
            COALESCE(SUM(tw.def_third_down_conversions), 0)::int as agg_def_third_down_conversions,
            COALESCE(SUM(tw.def_fourth_down_attempts), 0)::int as agg_def_fourth_down_attempts,
            COALESCE(SUM(tw.def_fourth_down_conversions), 0)::int as agg_def_fourth_down_conversions,
            COALESCE(SUM(tw.def_three_and_outs), 0)::int as agg_def_three_and_outs,
            COALESCE(SUM(tw.def_early_down_epa), 0) as agg_def_early_down_epa,
            COALESCE(SUM(tw.def_early_down_success), 0)::int as agg_def_early_down_success,
            COALESCE(SUM(tw.def_early_down_wpa), 0) as agg_def_early_down_wpa,
            COALESCE(SUM(tw.def_late_down_epa), 0) as agg_def_late_down_epa,
            COALESCE(SUM(tw.def_late_down_success), 0)::int as agg_def_late_down_success,
            COALESCE(SUM(tw.def_late_down_wpa), 0) as agg_def_late_down_wpa,
            COALESCE(SUM(tw.def_early_down_total), 0)::int as agg_def_early_down_total,
            COALESCE(SUM(tw.def_late_down_total), 0)::int as agg_def_late_down_total,

            -- Win/Loss aggregations
            COUNT(*)::int as games_played,
            COALESCE(SUM(tw.win::int), 0)::int as wins,
            COALESCE(SUM(tw.loss::int), 0)::int as losses,
            COALESCE(SUM(tw.tie::int), 0)::int as ties

        FROM team_week tw
        JOIN teams t ON tw.team_id = t.team_id
        JOIN weeks w ON tw.season = w.season AND tw.week = w.week
        WHERE (p_team_id IS NULL OR tw.team_id = p_team_id)
          AND (p_season_start IS NULL OR tw.season >= p_season_start)
          AND (p_season_end IS NULL OR tw.season <= p_season_end)
          AND (p_week_start IS NULL OR tw.week >= p_week_start)
          AND (p_week_end IS NULL OR tw.week <= p_week_end)
          AND (p_season_type IS NULL OR w.season_type = ANY(v_season_types))
        GROUP BY tw.team_id, t.display_name, t.abbr
    )
    SELECT 
        tt.team_id,
        tt.team_name,
        tt.team_abbr,
        
        -- Win/Loss record
        tt.games_played,
        CONCAT(tt.wins, '-', tt.losses, '-', tt.ties) as record,
        CASE WHEN tt.games_played > 0 THEN ROUND(tt.wins::decimal / tt.games_played, 3) ELSE 0 END,
        
        -- Raw offensive passing stats (aggregated)
        tt.agg_off_pass_attempts,
        tt.agg_off_pass_yards,
        tt.agg_off_pass_completions,
        tt.agg_off_pass_touchdowns,
        tt.agg_off_pass_ints,
        tt.agg_off_pass_sacks,
        tt.agg_off_pass_sack_yards,
        tt.agg_off_pass_air_yards,
        tt.agg_off_pass_qb_hit,
        tt.agg_off_pass_first_downs,
        tt.agg_off_pass_yac_total,
        tt.agg_off_pass_epa,
        tt.agg_off_pass_wpa,
        tt.agg_off_pass_success_total,
        tt.agg_off_pass_20_plus,
        tt.agg_off_pass_dropbacks,
        
        -- Calculated offensive passing stats (from aggregated totals - CORRECT!)
        CASE WHEN tt.agg_off_pass_attempts > 0 THEN ROUND(tt.agg_off_pass_completions::decimal / tt.agg_off_pass_attempts * 100, 1) ELSE 0 END,
        CASE WHEN tt.agg_off_pass_attempts > 0 THEN ROUND(tt.agg_off_pass_air_yards::decimal / tt.agg_off_pass_attempts, 2) ELSE 0 END,
        CASE WHEN tt.agg_off_pass_completions > 0 THEN ROUND(tt.agg_off_pass_air_yards::decimal / tt.agg_off_pass_completions, 2) ELSE 0 END,
        CASE WHEN tt.agg_off_pass_attempts > 0 THEN ROUND(tt.agg_off_pass_yac_total::decimal / tt.agg_off_pass_attempts, 2) ELSE 0 END,
        CASE WHEN tt.agg_off_pass_completions > 0 THEN ROUND(tt.agg_off_pass_yac_total::decimal / tt.agg_off_pass_completions, 2) ELSE 0 END,
        CASE WHEN tt.agg_off_pass_dropbacks > 0 THEN ROUND(tt.agg_off_pass_sacks::decimal / tt.agg_off_pass_dropbacks * 100, 2) ELSE 0 END,
        CASE WHEN tt.agg_off_pass_dropbacks > 0 THEN ROUND(tt.agg_off_pass_qb_hit::decimal / tt.agg_off_pass_dropbacks * 100, 2) ELSE 0 END,
        CASE WHEN tt.agg_off_pass_attempts > 0 THEN ROUND(tt.agg_off_pass_success_total::decimal / tt.agg_off_pass_attempts * 100, 1) ELSE 0 END,
        CASE WHEN tt.agg_off_pass_attempts > 0 THEN ROUND(tt.agg_off_pass_20_plus::decimal / tt.agg_off_pass_attempts * 100, 2) ELSE 0 END,
        ROUND(tt.agg_off_pass_yards::decimal, 1),
        CASE WHEN tt.agg_off_pass_attempts > 0 THEN ROUND(tt.agg_off_pass_air_yards::decimal / tt.agg_off_pass_attempts, 1) ELSE 0 END,
        CASE WHEN tt.agg_off_pass_attempts > 0 THEN ROUND(tt.agg_off_pass_epa::decimal / tt.agg_off_pass_attempts, 3) ELSE 0 END,
        CASE WHEN tt.agg_off_pass_completions > 0 THEN ROUND(tt.agg_off_pass_epa::decimal / tt.agg_off_pass_completions, 3) ELSE 0 END,
        CASE WHEN tt.agg_off_pass_dropbacks > 0 THEN ROUND(tt.agg_off_pass_epa::decimal / tt.agg_off_pass_dropbacks, 3) ELSE 0 END,
        CASE WHEN tt.agg_off_pass_attempts > 0 THEN ROUND(tt.agg_off_pass_wpa::decimal / tt.agg_off_pass_attempts, 4) ELSE 0 END,
        CASE WHEN tt.agg_off_pass_completions > 0 THEN ROUND(tt.agg_off_pass_wpa::decimal / tt.agg_off_pass_completions, 4) ELSE 0 END,
        CASE WHEN tt.agg_off_pass_dropbacks > 0 THEN ROUND(tt.agg_off_pass_wpa::decimal / tt.agg_off_pass_dropbacks, 4) ELSE 0 END,
        
        -- Raw offensive rushing stats (aggregated)
        tt.agg_off_rush_attempts,
        tt.agg_off_rush_yards,
        tt.agg_off_rush_touchdowns,
        tt.agg_off_rush_stuffs,
        tt.agg_off_rush_10_plus,
        tt.agg_off_rush_20_plus,
        tt.agg_off_rush_first_downs,
        tt.agg_off_rush_epa_total,
        tt.agg_off_rush_success_total,
        tt.agg_off_rush_wpa_total,
        
        -- Calculated offensive rushing stats (from aggregated totals - CORRECT!)
        CASE WHEN tt.agg_off_rush_attempts > 0 THEN ROUND(tt.agg_off_rush_yards::decimal / tt.agg_off_rush_attempts, 2) ELSE 0 END,
        CASE WHEN tt.agg_off_rush_attempts > 0 THEN ROUND(tt.agg_off_rush_touchdowns::decimal / tt.agg_off_rush_attempts * 100, 2) ELSE 0 END,
        CASE WHEN tt.agg_off_rush_attempts > 0 THEN ROUND(tt.agg_off_rush_stuffs::decimal / tt.agg_off_rush_attempts * 100, 2) ELSE 0 END,
        CASE WHEN tt.agg_off_rush_attempts > 0 THEN ROUND(tt.agg_off_rush_10_plus::decimal / tt.agg_off_rush_attempts * 100, 2) ELSE 0 END,
        CASE WHEN tt.agg_off_rush_attempts > 0 THEN ROUND(tt.agg_off_rush_20_plus::decimal / tt.agg_off_rush_attempts * 100, 2) ELSE 0 END,
        ROUND(tt.agg_off_rush_yards::decimal, 1),
        CASE WHEN tt.agg_off_rush_attempts > 0 THEN ROUND(tt.agg_off_rush_epa_total::decimal / tt.agg_off_rush_attempts, 3) ELSE 0 END,
        CASE WHEN tt.agg_off_rush_attempts > 0 THEN ROUND(tt.agg_off_rush_success_total::decimal / tt.agg_off_rush_attempts * 100, 1) ELSE 0 END,
        CASE WHEN tt.agg_off_rush_attempts > 0 THEN ROUND(tt.agg_off_rush_wpa_total::decimal / tt.agg_off_rush_attempts, 4) ELSE 0 END,
        
        -- Raw offensive total stats (aggregated)
        tt.agg_off_plays_total,
        tt.agg_off_drives_total,
        tt.agg_off_yards_total,
        tt.agg_off_points_total,
        tt.agg_off_first_downs,
        tt.agg_off_touchdowns,
        tt.agg_off_fumbles,
        tt.agg_off_fumbles_lost,
        tt.agg_off_turnovers,
        tt.agg_off_epa,
        tt.agg_off_wpa,
        tt.agg_off_success_total,
        tt.agg_off_explosive_plays,
        
        -- Calculated offensive total stats (from aggregated totals)
        CASE WHEN tt.games_played > 0 THEN ROUND(tt.agg_off_yards_total::decimal / tt.games_played, 1) ELSE 0 END,
        CASE WHEN tt.agg_off_drives_total > 0 THEN ROUND(tt.agg_off_yards_total::decimal / tt.agg_off_drives_total, 2) ELSE 0 END,
        CASE WHEN tt.agg_off_plays_total > 0 THEN ROUND(tt.agg_off_yards_total::decimal / tt.agg_off_plays_total, 2) ELSE 0 END,
        CASE WHEN tt.games_played > 0 THEN ROUND(tt.agg_off_points_total::decimal / tt.games_played, 1) ELSE 0 END,
        CASE WHEN tt.agg_off_drives_total > 0 THEN ROUND(tt.agg_off_points_total::decimal / tt.agg_off_drives_total, 2) ELSE 0 END,
        CASE WHEN tt.agg_off_plays_total > 0 THEN ROUND(tt.agg_off_points_total::decimal / tt.agg_off_plays_total, 2) ELSE 0 END,
        CASE WHEN tt.games_played > 0 THEN ROUND(tt.agg_off_epa::decimal / tt.games_played, 2) ELSE 0 END,
        CASE WHEN tt.agg_off_drives_total > 0 THEN ROUND(tt.agg_off_epa::decimal / tt.agg_off_drives_total, 3) ELSE 0 END,
        CASE WHEN tt.agg_off_plays_total > 0 THEN ROUND(tt.agg_off_epa::decimal / tt.agg_off_plays_total, 3) ELSE 0 END,
        CASE WHEN tt.games_played > 0 THEN ROUND(tt.agg_off_wpa::decimal / tt.games_played, 4) ELSE 0 END,
        CASE WHEN tt.agg_off_drives_total > 0 THEN ROUND(tt.agg_off_wpa::decimal / tt.agg_off_drives_total, 4) ELSE 0 END,
        CASE WHEN tt.agg_off_plays_total > 0 THEN ROUND(tt.agg_off_wpa::decimal / tt.agg_off_plays_total, 4) ELSE 0 END,
        CASE WHEN tt.agg_off_plays_total > 0 THEN ROUND(tt.agg_off_success_total::decimal / tt.agg_off_plays_total * 100, 1) ELSE 0 END,
        CASE WHEN tt.agg_off_plays_total > 0 THEN ROUND(tt.agg_off_explosive_plays::decimal / tt.agg_off_plays_total * 100, 2) ELSE 0 END,
        
        -- Raw offensive situational stats (aggregated)
        tt.agg_off_third_down_attempts,
        tt.agg_off_third_down_conversions,
        tt.agg_off_fourth_down_attempts,
        tt.agg_off_fourth_down_conversions,
        tt.agg_off_three_and_outs,
        tt.agg_off_early_down_epa,
        tt.agg_off_early_down_success,
        tt.agg_off_early_down_wpa,
        tt.agg_off_late_down_epa,
        tt.agg_off_late_down_success,
        tt.agg_off_late_down_wpa,
        tt.agg_off_early_down_total,
        tt.agg_off_late_down_total,
        
        -- Calculated offensive situational stats (from aggregated totals - CORRECT!)
        CASE WHEN tt.agg_off_third_down_attempts > 0 THEN ROUND(tt.agg_off_third_down_conversions::decimal / tt.agg_off_third_down_attempts * 100, 1) ELSE 0 END,
        CASE WHEN tt.agg_off_fourth_down_attempts > 0 THEN ROUND(tt.agg_off_fourth_down_conversions::decimal / tt.agg_off_fourth_down_attempts * 100, 1) ELSE 0 END,
        CASE WHEN tt.agg_off_drives_total > 0 THEN ROUND(tt.agg_off_three_and_outs::decimal / tt.agg_off_drives_total * 100, 1) ELSE 0 END,
        CASE WHEN tt.agg_off_early_down_total > 0 THEN ROUND(tt.agg_off_early_down_epa::decimal / tt.agg_off_early_down_total, 3) ELSE 0 END,
        CASE WHEN tt.agg_off_early_down_total > 0 THEN ROUND(tt.agg_off_early_down_success::decimal / tt.agg_off_early_down_total * 100, 1) ELSE 0 END,
        CASE WHEN tt.agg_off_early_down_total > 0 THEN ROUND(tt.agg_off_early_down_wpa::decimal / tt.agg_off_early_down_total, 4) ELSE 0 END,
        CASE WHEN tt.agg_off_late_down_total > 0 THEN ROUND(tt.agg_off_late_down_epa::decimal / tt.agg_off_late_down_total, 3) ELSE 0 END,
        CASE WHEN tt.agg_off_late_down_total > 0 THEN ROUND(tt.agg_off_late_down_success::decimal / tt.agg_off_late_down_total * 100, 1) ELSE 0 END,
        CASE WHEN tt.agg_off_late_down_total > 0 THEN ROUND(tt.agg_off_late_down_wpa::decimal / tt.agg_off_late_down_total, 4) ELSE 0 END,
        
        -- Raw defensive passing stats (aggregated)
        tt.agg_def_pass_attempts,
        tt.agg_def_pass_yards,
        tt.agg_def_pass_completions,
        tt.agg_def_pass_touchdowns,
        tt.agg_def_pass_ints,
        tt.agg_def_pass_sacks,
        tt.agg_def_pass_sack_yards,
        tt.agg_def_pass_air_yards,
        tt.agg_def_pass_qb_hit,
        tt.agg_def_pass_first_downs,
        tt.agg_def_pass_yac_total,
        tt.agg_def_pass_epa,
        tt.agg_def_pass_wpa,
        tt.agg_def_pass_success_total,
        tt.agg_def_pass_20_plus,
        tt.agg_def_pass_dropbacks,
        
        -- Calculated defensive passing stats (from aggregated totals - CORRECT!)
        CASE WHEN tt.agg_def_pass_attempts > 0 THEN ROUND(tt.agg_def_pass_completions::decimal / tt.agg_def_pass_attempts * 100, 1) ELSE 0 END,
        CASE WHEN tt.agg_def_pass_attempts > 0 THEN ROUND(tt.agg_def_pass_air_yards::decimal / tt.agg_def_pass_attempts, 2) ELSE 0 END,
        CASE WHEN tt.agg_def_pass_completions > 0 THEN ROUND(tt.agg_def_pass_air_yards::decimal / tt.agg_def_pass_completions, 2) ELSE 0 END,
        CASE WHEN tt.agg_def_pass_attempts > 0 THEN ROUND(tt.agg_def_pass_yac_total::decimal / tt.agg_def_pass_attempts, 2) ELSE 0 END,
        CASE WHEN tt.agg_def_pass_completions > 0 THEN ROUND(tt.agg_def_pass_yac_total::decimal / tt.agg_def_pass_completions, 2) ELSE 0 END,
        CASE WHEN tt.agg_def_pass_dropbacks > 0 THEN ROUND(tt.agg_def_pass_sacks::decimal / tt.agg_def_pass_dropbacks * 100, 2) ELSE 0 END,
        CASE WHEN tt.agg_def_pass_dropbacks > 0 THEN ROUND(tt.agg_def_pass_qb_hit::decimal / tt.agg_def_pass_dropbacks * 100, 2) ELSE 0 END,
        CASE WHEN tt.agg_def_pass_attempts > 0 THEN ROUND(tt.agg_def_pass_success_total::decimal / tt.agg_def_pass_attempts * 100, 1) ELSE 0 END,
        CASE WHEN tt.agg_def_pass_attempts > 0 THEN ROUND(tt.agg_def_pass_20_plus::decimal / tt.agg_def_pass_attempts * 100, 2) ELSE 0 END,
        ROUND(tt.agg_def_pass_yards::decimal, 1),
        CASE WHEN tt.agg_def_pass_attempts > 0 THEN ROUND(tt.agg_def_pass_air_yards::decimal / tt.agg_def_pass_attempts, 1) ELSE 0 END,
        CASE WHEN tt.agg_def_pass_attempts > 0 THEN ROUND(tt.agg_def_pass_epa::decimal / tt.agg_def_pass_attempts, 3) ELSE 0 END,
        CASE WHEN tt.agg_def_pass_completions > 0 THEN ROUND(tt.agg_def_pass_epa::decimal / tt.agg_def_pass_completions, 3) ELSE 0 END,
        CASE WHEN tt.agg_def_pass_dropbacks > 0 THEN ROUND(tt.agg_def_pass_epa::decimal / tt.agg_def_pass_dropbacks, 3) ELSE 0 END,
        CASE WHEN tt.agg_def_pass_attempts > 0 THEN ROUND(tt.agg_def_pass_wpa::decimal / tt.agg_def_pass_attempts, 4) ELSE 0 END,
        CASE WHEN tt.agg_def_pass_completions > 0 THEN ROUND(tt.agg_def_pass_wpa::decimal / tt.agg_def_pass_completions, 4) ELSE 0 END,
        CASE WHEN tt.agg_def_pass_dropbacks > 0 THEN ROUND(tt.agg_def_pass_wpa::decimal / tt.agg_def_pass_dropbacks, 4) ELSE 0 END,
        
        -- Raw defensive rushing stats (aggregated)
        tt.agg_def_rush_attempts,
        tt.agg_def_rush_yards,
        tt.agg_def_rush_touchdowns,
        tt.agg_def_rush_stuffs,
        tt.agg_def_rush_10_plus,
        tt.agg_def_rush_20_plus,
        tt.agg_def_rush_first_downs,
        tt.agg_def_rush_epa_total,
        tt.agg_def_rush_success_total,
        tt.agg_def_rush_wpa_total,
        
        -- Calculated defensive rushing stats (from aggregated totals - CORRECT!)
        CASE WHEN tt.agg_def_rush_attempts > 0 THEN ROUND(tt.agg_def_rush_yards::decimal / tt.agg_def_rush_attempts, 2) ELSE 0 END,
        CASE WHEN tt.agg_def_rush_attempts > 0 THEN ROUND(tt.agg_def_rush_touchdowns::decimal / tt.agg_def_rush_attempts * 100, 2) ELSE 0 END,
        CASE WHEN tt.agg_def_rush_attempts > 0 THEN ROUND(tt.agg_def_rush_stuffs::decimal / tt.agg_def_rush_attempts * 100, 2) ELSE 0 END,
        CASE WHEN tt.agg_def_rush_attempts > 0 THEN ROUND(tt.agg_def_rush_10_plus::decimal / tt.agg_def_rush_attempts * 100, 2) ELSE 0 END,
        CASE WHEN tt.agg_def_rush_attempts > 0 THEN ROUND(tt.agg_def_rush_20_plus::decimal / tt.agg_def_rush_attempts * 100, 2) ELSE 0 END,
        ROUND(tt.agg_def_rush_yards::decimal, 1),
        CASE WHEN tt.agg_def_rush_attempts > 0 THEN ROUND(tt.agg_def_rush_epa_total::decimal / tt.agg_def_rush_attempts, 3) ELSE 0 END,
        CASE WHEN tt.agg_def_rush_attempts > 0 THEN ROUND(tt.agg_def_rush_success_total::decimal / tt.agg_def_rush_attempts * 100, 1) ELSE 0 END,
        CASE WHEN tt.agg_def_rush_attempts > 0 THEN ROUND(tt.agg_def_rush_wpa_total::decimal / tt.agg_def_rush_attempts, 4) ELSE 0 END,
        
        -- Raw defensive total stats (aggregated)
        tt.agg_def_plays_total,
        tt.agg_def_drives_total,
        tt.agg_def_yards_total,
        tt.agg_def_points_total,
        tt.agg_def_first_downs,
        tt.agg_def_touchdowns,
        tt.agg_def_fumbles,
        tt.agg_def_fumbles_lost,
        tt.agg_def_turnovers,
        tt.agg_def_epa,
        tt.agg_def_wpa,
        tt.agg_def_success_total,
        tt.agg_def_explosive_plays,
        
        -- Calculated defensive total stats (from aggregated totals)
        CASE WHEN tt.games_played > 0 THEN ROUND(tt.agg_def_yards_total::decimal / tt.games_played, 1) ELSE 0 END,
        CASE WHEN tt.agg_def_drives_total > 0 THEN ROUND(tt.agg_def_yards_total::decimal / tt.agg_def_drives_total, 2) ELSE 0 END,
        CASE WHEN tt.agg_def_plays_total > 0 THEN ROUND(tt.agg_def_yards_total::decimal / tt.agg_def_plays_total, 2) ELSE 0 END,
        CASE WHEN tt.games_played > 0 THEN ROUND(tt.agg_def_points_total::decimal / tt.games_played, 1) ELSE 0 END,
        CASE WHEN tt.agg_def_drives_total > 0 THEN ROUND(tt.agg_def_points_total::decimal / tt.agg_def_drives_total, 2) ELSE 0 END,
        CASE WHEN tt.agg_def_plays_total > 0 THEN ROUND(tt.agg_def_points_total::decimal / tt.agg_def_plays_total, 2) ELSE 0 END,
        CASE WHEN tt.games_played > 0 THEN ROUND(tt.agg_def_epa::decimal / tt.games_played, 2) ELSE 0 END,
        CASE WHEN tt.agg_def_drives_total > 0 THEN ROUND(tt.agg_def_epa::decimal / tt.agg_def_drives_total, 3) ELSE 0 END,
        CASE WHEN tt.agg_def_plays_total > 0 THEN ROUND(tt.agg_def_epa::decimal / tt.agg_def_plays_total, 3) ELSE 0 END,
        CASE WHEN tt.games_played > 0 THEN ROUND(tt.agg_def_wpa::decimal / tt.games_played, 4) ELSE 0 END,
        CASE WHEN tt.agg_def_drives_total > 0 THEN ROUND(tt.agg_def_wpa::decimal / tt.agg_def_drives_total, 4) ELSE 0 END,
        CASE WHEN tt.agg_def_plays_total > 0 THEN ROUND(tt.agg_def_wpa::decimal / tt.agg_def_plays_total, 4) ELSE 0 END,
        CASE WHEN tt.agg_def_plays_total > 0 THEN ROUND(tt.agg_def_success_total::decimal / tt.agg_def_plays_total * 100, 1) ELSE 0 END,
        CASE WHEN tt.agg_def_plays_total > 0 THEN ROUND(tt.agg_def_explosive_plays::decimal / tt.agg_def_plays_total * 100, 2) ELSE 0 END,
        
        -- Raw defensive situational stats (aggregated)
        tt.agg_def_third_down_attempts,
        tt.agg_def_third_down_conversions,
        tt.agg_def_fourth_down_attempts,
        tt.agg_def_fourth_down_conversions,
        tt.agg_def_three_and_outs,
        tt.agg_def_early_down_epa,
        tt.agg_def_early_down_success,
        tt.agg_def_early_down_wpa,
        tt.agg_def_late_down_epa,
        tt.agg_def_late_down_success,
        tt.agg_def_late_down_wpa,
        tt.agg_def_early_down_total,
        tt.agg_def_late_down_total,
        
        -- Calculated defensive situational stats (from aggregated totals - CORRECT!)
        CASE WHEN tt.agg_def_third_down_attempts > 0 THEN ROUND(tt.agg_def_third_down_conversions::decimal / tt.agg_def_third_down_attempts * 100, 1) ELSE 0 END,
        CASE WHEN tt.agg_def_fourth_down_attempts > 0 THEN ROUND(tt.agg_def_fourth_down_conversions::decimal / tt.agg_def_fourth_down_attempts * 100, 1) ELSE 0 END,
        CASE WHEN tt.agg_def_drives_total > 0 THEN ROUND(tt.agg_def_three_and_outs::decimal / tt.agg_def_drives_total * 100, 1) ELSE 0 END,
        CASE WHEN tt.agg_def_early_down_total > 0 THEN ROUND(tt.agg_def_early_down_epa::decimal / tt.agg_def_early_down_total, 3) ELSE 0 END,
        CASE WHEN tt.agg_def_early_down_total > 0 THEN ROUND(tt.agg_def_early_down_success::decimal / tt.agg_def_early_down_total * 100, 1) ELSE 0 END,
        CASE WHEN tt.agg_def_early_down_total > 0 THEN ROUND(tt.agg_def_early_down_wpa::decimal / tt.agg_def_early_down_total, 4) ELSE 0 END,
        CASE WHEN tt.agg_def_late_down_total > 0 THEN ROUND(tt.agg_def_late_down_epa::decimal / tt.agg_def_late_down_total, 3) ELSE 0 END,
        CASE WHEN tt.agg_def_late_down_total > 0 THEN ROUND(tt.agg_def_late_down_success::decimal / tt.agg_def_late_down_total * 100, 1) ELSE 0 END,
        CASE WHEN tt.agg_def_late_down_total > 0 THEN ROUND(tt.agg_def_late_down_wpa::decimal / tt.agg_def_late_down_total, 4) ELSE 0 END
        
    FROM team_totals tt;
END;
$$ LANGUAGE plpgsql;

COMMIT;