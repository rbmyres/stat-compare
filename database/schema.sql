BEGIN;

DROP VIEW IF EXISTS public.v_player_week_enriched CASCADE;
DROP VIEW IF EXISTS public.v_team_week_enriched CASCADE;

DROP TABLE IF EXISTS public.team_week CASCADE;
DROP TABLE IF EXISTS public.player_week CASCADE;
DROP TABLE IF EXISTS public.weeks CASCADE;
DROP TABLE IF EXISTS public.players CASCADE;
DROP TABLE IF EXISTS public.teams CASCADE;

CREATE TABLE public.teams (
  team_id varchar(3) PRIMARY KEY,
  abbr text,
  display_name text,
  nickname text,
  primary_color text
);

CREATE TABLE public.players (
  player_id varchar(32) PRIMARY KEY,
  first_name text,
  last_name text,
  first_season int,
  last_season int
);

CREATE TABLE public.weeks (
  season int NOT NULL,
  week int NOT NULL CHECK (week BETWEEN 1 AND 22),
  season_type varchar(10) NOT NULL DEFAULT 'REG' CHECK (season_type IN ('REG', 'POST')),
  PRIMARY KEY (season, week)
);

CREATE TABLE public.player_week (
  player_id varchar(32) NOT NULL,
  season int NOT NULL,
  week int NOT NULL,
  team_id varchar(3) NOT NULL,
  position varchar(5) NOT NULL,
  
  -- Game outcome (binary columns for performance)
  win boolean DEFAULT false,
  loss boolean DEFAULT false,
  tie boolean DEFAULT false,
  
  -- Passing stats
  pass_attempts int DEFAULT 0,
  pass_completions int DEFAULT 0,
  pass_yards int DEFAULT 0,
  pass_touchdowns int DEFAULT 0,
  pass_ints int DEFAULT 0,
  pass_sacks int DEFAULT 0,
  pass_sack_yards int DEFAULT 0,
  pass_air_yards int DEFAULT 0,
  pass_yac_total int DEFAULT 0,
  pass_qb_hits int DEFAULT 0,
  pass_qb_dropbacks int DEFAULT 0,
  pass_first_downs int DEFAULT 0,
  pass_epa decimal(8,4) DEFAULT 0,
  pass_wpa decimal(8,4) DEFAULT 0,
  pass_cpoe_total decimal(8,4) DEFAULT 0,
  pass_success_total int DEFAULT 0,
  pass_20_plus int DEFAULT 0,
  pass_long int DEFAULT 0,
  pass_yac_epa_total decimal(8,4) DEFAULT 0,
  pass_yac_wpa_total decimal(8,4) DEFAULT 0,
  
  -- Rushing stats
  rush_attempts int DEFAULT 0,
  rush_yards int DEFAULT 0,
  rush_touchdowns int DEFAULT 0,
  rush_long int DEFAULT 0,
  rush_stuffs int DEFAULT 0,
  rush_10_plus int DEFAULT 0,
  rush_20_plus int DEFAULT 0,
  rush_first_downs int DEFAULT 0,
  rush_epa_total decimal(8,4) DEFAULT 0,
  rush_wpa_total decimal(8,4) DEFAULT 0,
  rush_success_total int DEFAULT 0,
  qb_scramble_attempts int DEFAULT 0,
  qb_scramble_yards int DEFAULT 0,
  qb_scramble_epa_total decimal(8,4) DEFAULT 0,
  qb_scramble_touchdowns int DEFAULT 0,
  qb_scramble_wpa_total decimal(8,4) DEFAULT 0,
  qb_scramble_success_total int DEFAULT 0,
  rush_fumbles int DEFAULT 0,
  rush_fumbles_lost int DEFAULT 0,
  
  -- Receiving stats
  rec_targets int DEFAULT 0,
  rec_receptions int DEFAULT 0,
  rec_yards int DEFAULT 0,
  rec_touchdowns int DEFAULT 0,
  rec_yac_total int DEFAULT 0,
  rec_first_downs int DEFAULT 0,
  rec_epa_total decimal(8,4) DEFAULT 0,
  rec_wpa_total decimal(8,4) DEFAULT 0,
  rec_success_total int DEFAULT 0,
  rec_yac_epa_total decimal(8,4) DEFAULT 0,
  rec_yac_wpa_total decimal(8,4) DEFAULT 0,
  rec_20_plus int DEFAULT 0,
  rec_long int DEFAULT 0,
  rec_air_yards_total int DEFAULT 0,
  rec_fumbles int DEFAULT 0,
  rec_fumbles_lost int DEFAULT 0,
  
  -- Total/summary stats
  total_yards int DEFAULT 0,
  total_plays int DEFAULT 0,
  total_touchdowns int DEFAULT 0,
  total_epa decimal(8,4) DEFAULT 0,
  total_wpa decimal(8,4) DEFAULT 0,
  total_first_downs int DEFAULT 0,
  total_success_plays int DEFAULT 0,
  total_fumbles int DEFAULT 0,
  total_fumbles_lost int DEFAULT 0,
  scrim_yards int DEFAULT 0,
  scrim_touches int DEFAULT 0,
  scrim_touchdowns int DEFAULT 0,
  scrim_epa_total decimal(8,4) DEFAULT 0,
  scrim_wpa_total decimal(8,4) DEFAULT 0,
  scrim_first_downs int DEFAULT 0,
  scrim_success_total int DEFAULT 0,
  
  PRIMARY KEY (player_id, season, week),
  FOREIGN KEY (player_id) REFERENCES public.players(player_id),
  FOREIGN KEY (season, week) REFERENCES public.weeks(season, week),
  FOREIGN KEY (team_id) REFERENCES public.teams(team_id)
);

-- Player week indexes
CREATE INDEX idx_pw_player_id ON public.player_week (player_id);
CREATE INDEX idx_pw_player_season_week ON public.player_week (player_id, season, week);
CREATE INDEX idx_pw_team_season_week ON public.player_week (team_id, season, week);
CREATE INDEX idx_pw_season_position_player ON public.player_week (season, position, player_id);

-- New optimized indexes for common query patterns
CREATE INDEX idx_pw_season_week_position ON public.player_week (season, week, position); -- For leaderboards
CREATE INDEX idx_pw_season_win ON public.player_week (season, win) WHERE win = true; -- Win filtering
CREATE INDEX idx_pw_season_loss ON public.player_week (season, loss) WHERE loss = true; -- Loss filtering
CREATE INDEX idx_pw_position_season_week ON public.player_week (position, season, week); -- Position-first queries
CREATE INDEX idx_pw_team_season_position ON public.player_week (team_id, season, position); -- Team roster queries

-- Covering indexes for read-heavy stat selection queries
CREATE INDEX idx_pw_season_covering ON public.player_week (season, week) 
INCLUDE (player_id, team_id, position, win, loss, tie, pass_yards, rush_yards, rec_yards, total_yards);

-- Partial indexes for recent/active data
CREATE INDEX idx_pw_recent_season ON public.player_week (player_id, week) 
WHERE season >= 2020; -- Only index recent seasons

CREATE TABLE public.team_week (
  team_id varchar(3) NOT NULL,
  season int NOT NULL,
  week int NOT NULL,
  
  -- Game outcome (binary columns for performance)
  win boolean DEFAULT false,
  loss boolean DEFAULT false,
  tie boolean DEFAULT false,
  
  -- Offensive passing stats
  off_pass_attempts int DEFAULT 0,
  off_pass_yards int DEFAULT 0,
  off_pass_completions int DEFAULT 0,
  off_pass_touchdowns int DEFAULT 0,
  off_pass_ints int DEFAULT 0,
  off_pass_sacks int DEFAULT 0,
  off_pass_sack_yards int DEFAULT 0,
  off_pass_air_yards int DEFAULT 0,
  off_pass_qb_hit int DEFAULT 0,
  off_pass_first_downs int DEFAULT 0,
  off_pass_yac_total int DEFAULT 0,
  off_pass_epa decimal(8,4) DEFAULT 0,
  off_pass_wpa decimal(8,4) DEFAULT 0,
  off_pass_success_total int DEFAULT 0,
  off_pass_20_plus int DEFAULT 0,
  off_pass_dropbacks int DEFAULT 0,
  
  -- Offensive rushing stats
  off_rush_attempts int DEFAULT 0,
  off_rush_yards int DEFAULT 0,
  off_rush_touchdowns int DEFAULT 0,
  off_rush_stuffs int DEFAULT 0,
  off_rush_10_plus int DEFAULT 0,
  off_rush_20_plus int DEFAULT 0,
  off_rush_first_downs int DEFAULT 0,
  off_rush_epa_total decimal(8,4) DEFAULT 0,
  off_rush_success_total int DEFAULT 0,
  off_rush_wpa_total decimal(8,4) DEFAULT 0,
  
  -- Offensive total stats
  off_points_total int DEFAULT 0,
  off_drives_total int DEFAULT 0,
  off_fumbles int DEFAULT 0,
  off_fumbles_lost int DEFAULT 0,
  off_turnovers int DEFAULT 0,
  off_plays_total int GENERATED ALWAYS AS (off_pass_attempts + off_rush_attempts + off_pass_sacks) STORED,
  off_yards_total int GENERATED ALWAYS AS (off_pass_yards + off_rush_yards - off_pass_sack_yards) STORED,
  off_first_downs int GENERATED ALWAYS AS (off_pass_first_downs + off_rush_first_downs) STORED,
  off_touchdowns int GENERATED ALWAYS AS (off_pass_touchdowns + off_rush_touchdowns) STORED,
  off_epa decimal(8,4) GENERATED ALWAYS AS (off_pass_epa + off_rush_epa_total) STORED,
  off_wpa decimal(8,4) GENERATED ALWAYS AS (off_pass_wpa + off_rush_wpa_total) STORED,
  off_success_total int GENERATED ALWAYS AS (off_pass_success_total + off_rush_success_total) STORED,
  off_explosive_plays int GENERATED ALWAYS AS (off_pass_20_plus + off_rush_10_plus) STORED,
  
  -- Offense situational stats
  off_third_down_attempts int DEFAULT 0,
  off_third_down_conversions int DEFAULT 0,
  off_fourth_down_attempts int DEFAULT 0,
  off_fourth_down_conversions int DEFAULT 0,
  off_three_and_outs int DEFAULT 0,
  off_early_down_epa decimal(8,4) DEFAULT 0,
  off_early_down_success int DEFAULT 0,
  off_early_down_wpa decimal(8,4) DEFAULT 0,
  off_late_down_epa decimal(8,4) DEFAULT 0,
  off_late_down_success int DEFAULT 0,
  off_late_down_wpa decimal(8,4) DEFAULT 0,
  off_early_down_total int DEFAULT 0,
  off_late_down_total int DEFAULT 0,
  
  -- Defensive passing stats
  def_pass_attempts int DEFAULT 0,
  def_pass_yards int DEFAULT 0,
  def_pass_completions int DEFAULT 0,
  def_pass_touchdowns int DEFAULT 0,
  def_pass_ints int DEFAULT 0,
  def_pass_sacks int DEFAULT 0,
  def_pass_sack_yards int DEFAULT 0,
  def_pass_air_yards int DEFAULT 0,
  def_pass_qb_hit int DEFAULT 0,
  def_pass_first_downs int DEFAULT 0,
  def_pass_yac_total int DEFAULT 0,
  def_pass_epa decimal(8,4) DEFAULT 0,
  def_pass_wpa decimal(8,4) DEFAULT 0,
  def_pass_success_total int DEFAULT 0,
  def_pass_20_plus int DEFAULT 0,
  def_pass_dropbacks int DEFAULT 0,
  
  -- Defensive rushing stats
  def_rush_attempts int DEFAULT 0,
  def_rush_yards int DEFAULT 0,
  def_rush_touchdowns int DEFAULT 0,
  def_rush_stuffs int DEFAULT 0,
  def_rush_10_plus int DEFAULT 0,
  def_rush_20_plus int DEFAULT 0,
  def_rush_first_downs int DEFAULT 0,
  def_rush_epa_total decimal(8,4) DEFAULT 0,
  def_rush_success_total int DEFAULT 0,
  def_rush_wpa_total decimal(8,4) DEFAULT 0,

    
  -- Defensive total stats
  def_points_total int DEFAULT 0,
  def_drives_total int DEFAULT 0,
  def_fumbles int DEFAULT 0,
  def_fumbles_lost int DEFAULT 0,
  def_turnovers int DEFAULT 0,
  def_plays_total int GENERATED ALWAYS AS (def_pass_attempts + def_rush_attempts + def_pass_sacks) STORED,
  def_yards_total int GENERATED ALWAYS AS (def_pass_yards + def_rush_yards - def_pass_sack_yards) STORED,
  def_first_downs int GENERATED ALWAYS AS (def_pass_first_downs + def_rush_first_downs) STORED,
  def_touchdowns int GENERATED ALWAYS AS (def_pass_touchdowns + def_rush_touchdowns) STORED,
  def_epa decimal(8,4) GENERATED ALWAYS AS (def_pass_epa + def_rush_epa_total) STORED,
  def_wpa decimal(8,4) GENERATED ALWAYS AS (def_pass_wpa + def_rush_wpa_total) STORED,
  def_success_total int GENERATED ALWAYS AS (def_pass_success_total + def_rush_success_total) STORED,
  def_explosive_plays int GENERATED ALWAYS AS (def_pass_20_plus + def_rush_20_plus) STORED,
  
  -- Defensive situational stats
  def_third_down_attempts int DEFAULT 0,
  def_third_down_conversions int DEFAULT 0,
  def_fourth_down_attempts int DEFAULT 0,
  def_fourth_down_conversions int DEFAULT 0,
  def_three_and_outs int DEFAULT 0,
  def_early_down_epa decimal(8,4) DEFAULT 0,
  def_early_down_success int DEFAULT 0,
  def_early_down_wpa decimal(8,4) DEFAULT 0,
  def_late_down_epa decimal(8,4) DEFAULT 0,
  def_late_down_success int DEFAULT 0,
  def_late_down_wpa decimal(8,4) DEFAULT 0,
  def_early_down_total int DEFAULT 0,
  def_late_down_total int DEFAULT 0,

  PRIMARY KEY (team_id, season, week),
  FOREIGN KEY (season, week) REFERENCES public.weeks(season, week),
  FOREIGN KEY (team_id) REFERENCES public.teams(team_id)
);
-- Team week indexes  
CREATE INDEX idx_tw_team_season_week ON public.team_week (team_id, season, week);

-- New optimized indexes for team queries
CREATE INDEX idx_tw_season_week ON public.team_week (season, week); -- For league-wide stats
CREATE INDEX idx_tw_season_win ON public.team_week (season, win) WHERE win = true; -- Win filtering
CREATE INDEX idx_tw_season_loss ON public.team_week (season, loss) WHERE loss = true; -- Loss filtering

-- Covering index for common team stat selections
CREATE INDEX idx_tw_season_covering ON public.team_week (season, week)
INCLUDE (team_id, win, loss, tie, off_yards_total, def_yards_total, off_points_total, def_points_total);

-- Weeks table index for season type filtering
CREATE INDEX idx_weeks_season_type ON public.weeks (season, season_type);

COMMIT;