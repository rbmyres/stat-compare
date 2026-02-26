// ── Types ────────────────────────────────────────────────────────────

export interface StatDefinition {
  label: string;
  abbr: string;
  description: string;
}

export interface GlossaryCategory {
  title: string;
  description: string;
  stats: string[];
}

// ── Definitions ─────────────────────────────────────────────────────

export const STAT_DEFINITIONS: Record<string, StatDefinition> = {
  // ── General ───────────────────────────────────────────────────────
  games_played: {
    label: "Games Played",
    abbr: "Games",
    description:
      "Total number of games the player or team appeared in during the selected period.",
  },
  record: {
    label: "Record",
    abbr: "Record",
    description: "Win-loss-tie record (W-L-T) during the selected period.",
  },
  win_percentage: {
    label: "Win Percentage",
    abbr: "Win %",
    description:
      "Percentage of games won. Calculated as wins divided by total games played.",
  },

  // ── Passing ───────────────────────────────────────────────────────
  pass_attempts: {
    label: "Pass Attempts",
    abbr: "Att",
    description:
      "Total number of pass attempts, including completions, incompletions, and interceptions.",
  },
  pass_completions: {
    label: "Pass Completions",
    abbr: "Comp",
    description: "Total number of completed passes caught by a receiver.",
  },
  pass_yards: {
    label: "Pass Yards",
    abbr: "Yards",
    description:
      "Total passing yards gained through the air, measured from the line of scrimmage to the point where the receiver was downed or went out of bounds.",
  },
  pass_touchdowns: {
    label: "Pass Touchdowns",
    abbr: "TD",
    description: "Total number of passing touchdowns thrown.",
  },
  pass_ints: {
    label: "Interceptions Thrown",
    abbr: "INT",
    description:
      "Total number of passes intercepted by the opposing defense.",
  },
  pass_rating: {
    label: "Passer Rating",
    abbr: "Rating",
    description:
      "NFL passer rating on a scale of 0–158.3. A composite metric factoring completion percentage, yards per attempt, touchdowns per attempt, and interceptions per attempt.",
  },
  pass_comp_percent: {
    label: "Completion Percentage",
    abbr: "Comp %",
    description:
      "Percentage of pass attempts that resulted in completions. Calculated as completions divided by attempts.",
  },
  pass_yards_per_attempt: {
    label: "Yards per Attempt",
    abbr: "Yds/Att",
    description:
      "Average passing yards gained per pass attempt.",
  },
  pass_yards_per_completion: {
    label: "Yards per Completion",
    abbr: "Yds/Comp",
    description:
      "Average passing yards gained per completed pass.",
  },
  pass_yards_per_game: {
    label: "Pass Yards per Game",
    abbr: "Yds/Game",
    description: "Average passing yards per game played.",
  },
  pass_sacks: {
    label: "Sacks Taken",
    abbr: "Sacks",
    description:
      "Total number of times the quarterback was sacked behind the line of scrimmage.",
  },
  pass_sack_yards: {
    label: "Sack Yards Lost",
    abbr: "Sack Yds",
    description:
      "Total yards lost on sacks.",
  },
  pass_qb_hit: {
    label: "QB Hits",
    abbr: "QB Hits",
    description:
      "Total number of times the quarterback was hit by a defender during or just after a pass attempt.",
  },
  pass_qb_dropbacks: {
    label: "QB Dropbacks",
    abbr: "Dropbacks",
    description:
      "Total number of quarterback dropbacks, including pass attempts, sacks, and scrambles.",
  },
  pass_first_downs: {
    label: "Passing First Downs",
    abbr: "1st Downs",
    description:
      "Total number of first downs earned through completed passes.",
  },
  pass_20_plus: {
    label: "20+ Yard Passes",
    abbr: "20+",
    description:
      "Total number of completed passes that gained 20 or more yards.",
  },
  pass_long: {
    label: "Longest Pass",
    abbr: "Long",
    description: "Longest completed pass in yards during the selected period.",
  },
  pass_air_yards: {
    label: "Air Yards",
    abbr: "Air Yds",
    description:
      "Total distance in yards the ball traveled in the air on all pass attempts, measured from the line of scrimmage to the point of catch or incompletion.",
  },
  pass_yac_total: {
    label: "Yards After Catch (Passing)",
    abbr: "YAC",
    description:
      "Total yards gained by receivers after the catch on this passer's completions.",
  },

  // ── Advanced Passing ──────────────────────────────────────────────
  pass_epa: {
    label: "Passing EPA",
    abbr: "EPA",
    description:
      "Expected Points Added on all pass plays. Measures the total value added above expectation on passing plays.",
  },
  pass_epa_per_attempt: {
    label: "Passing EPA per Attempt",
    abbr: "EPA/Att",
    description:
      "Expected Points Added per pass attempt. Indicates average efficiency per throw.",
  },
  pass_epa_per_completion: {
    label: "Passing EPA per Completion",
    abbr: "EPA/Comp",
    description:
      "Expected Points Added per completed pass.",
  },
  pass_epa_per_dropback: {
    label: "Passing EPA per Dropback",
    abbr: "EPA/Dropback",
    description:
      "Expected Points Added per dropback, including sacks and scrambles. The most holistic EPA measure for passers.",
  },
  pass_cpoe: {
    label: "CPOE",
    abbr: "CPOE",
    description:
      "Completion Percentage Over Expected. The difference between actual completion rate and the expected completion rate based on throw difficulty, depth, and coverage.",
  },
  pass_cpoe_total: {
    label: "CPOE Total",
    abbr: "CPOE Total",
    description:
      "Cumulative CPOE across all pass attempts. A positive total indicates consistently completing passes at a rate above expectation.",
  },
  pass_success_total: {
    label: "Passing Successful Plays",
    abbr: "Success",
    description:
      "Total number of pass plays considered successful. A play is successful if it gains enough EPA to be considered positive for the offense.",
  },
  pass_success_rate: {
    label: "Passing Success Rate",
    abbr: "Success %",
    description:
      "Percentage of pass plays that were successful (gained positive EPA).",
  },
  pass_td_percent: {
    label: "Touchdown Percentage",
    abbr: "TD %",
    description:
      "Percentage of pass attempts that resulted in a touchdown.",
  },
  pass_int_percent: {
    label: "Interception Percentage",
    abbr: "INT %",
    description:
      "Percentage of pass attempts that resulted in an interception.",
  },
  pass_sack_percent: {
    label: "Sack Percentage",
    abbr: "Sack %",
    description:
      "Percentage of dropbacks that resulted in a sack.",
  },
  pass_qb_hit_percent: {
    label: "QB Hit Percentage",
    abbr: "QB Hit %",
    description:
      "Percentage of dropbacks on which the quarterback was hit.",
  },
  pass_first_down_rate: {
    label: "Passing First Down Rate",
    abbr: "1st Down %",
    description:
      "Percentage of pass attempts that resulted in a first down.",
  },
  pass_20_plus_rate: {
    label: "20+ Yard Pass Rate",
    abbr: "20+ %",
    description:
      "Percentage of pass attempts that resulted in a gain of 20 or more yards.",
  },
  pass_average_depth_of_target: {
    label: "Average Depth of Target",
    abbr: "aDOT",
    description:
      "Average distance in yards the ball was thrown past the line of scrimmage on all pass attempts. Higher aDOT indicates a more aggressive, downfield passing approach.",
  },
  pass_air_yards_per_attempt: {
    label: "Air Yards per Attempt",
    abbr: "Air Yds/Att",
    description:
      "Average air yards per pass attempt. Similar to aDOT but accounts for all attempts including throwaways.",
  },
  pass_air_yards_per_completion: {
    label: "Air Yards per Completion",
    abbr: "Air Yds/Comp",
    description:
      "Average air yards per completed pass.",
  },
  pass_yac_per_attempt: {
    label: "YAC per Attempt",
    abbr: "YAC/Att",
    description:
      "Average yards after catch generated per pass attempt.",
  },
  pass_yac_per_completion: {
    label: "YAC per Completion",
    abbr: "YAC/Comp",
    description:
      "Average yards after catch generated per completed pass.",
  },

  // ── Rushing ───────────────────────────────────────────────────────
  rush_attempts: {
    label: "Rush Attempts",
    abbr: "Carries",
    description:
      "Total number of rushing attempts (carries).",
  },
  rush_yards: {
    label: "Rush Yards",
    abbr: "Yards",
    description: "Total yards gained on rushing plays.",
  },
  rush_touchdowns: {
    label: "Rush Touchdowns",
    abbr: "TD",
    description: "Total number of rushing touchdowns scored.",
  },
  rush_yards_per_carry: {
    label: "Yards per Carry",
    abbr: "Yds/Carry",
    description: "Average yards gained per rushing attempt.",
  },
  rush_yards_per_game: {
    label: "Rush Yards per Game",
    abbr: "Yds/Game",
    description: "Average rushing yards per game played.",
  },
  rush_long: {
    label: "Longest Rush",
    abbr: "Long",
    description: "Longest rushing gain in yards during the selected period.",
  },
  rush_first_downs: {
    label: "Rushing First Downs",
    abbr: "1st Downs",
    description:
      "Total number of first downs earned through rushing plays.",
  },
  rush_stuffs: {
    label: "Stuffed Runs",
    abbr: "Stuffs",
    description:
      "Total number of rushing attempts that were stopped at or behind the line of scrimmage for zero or negative yards.",
  },
  rush_10_plus: {
    label: "10+ Yard Rushes",
    abbr: "10+",
    description:
      "Total number of rushing attempts that gained 10 or more yards.",
  },
  rush_20_plus: {
    label: "20+ Yard Rushes",
    abbr: "20+",
    description:
      "Total number of rushing attempts that gained 20 or more yards.",
  },
  rush_fumbles: {
    label: "Rush Fumbles",
    abbr: "Fumbles",
    description: "Total number of fumbles on rushing plays.",
  },
  rush_fumbles_lost: {
    label: "Rush Fumbles Lost",
    abbr: "Fum Lost",
    description:
      "Total number of fumbles on rushing plays that were recovered by the opposing team.",
  },

  // ── Advanced Rushing ──────────────────────────────────────────────
  rush_epa_total: {
    label: "Rushing EPA",
    abbr: "EPA",
    description:
      "Expected Points Added on all rushing plays. Measures the total value added above expectation on the ground.",
  },
  rush_epa_per_attempt: {
    label: "Rushing EPA per Attempt",
    abbr: "EPA/Att",
    description:
      "Expected Points Added per rushing attempt. Indicates average efficiency per carry.",
  },
  rush_success_total: {
    label: "Rushing Successful Plays",
    abbr: "Success",
    description:
      "Total number of rushing plays considered successful (gained positive EPA).",
  },
  rush_success_rate: {
    label: "Rushing Success Rate",
    abbr: "Success %",
    description:
      "Percentage of rushing plays that were successful (gained positive EPA).",
  },
  rush_touchdown_rate: {
    label: "Rush Touchdown Rate",
    abbr: "TD %",
    description:
      "Percentage of rushing attempts that resulted in a touchdown.",
  },
  rush_stuff_rate: {
    label: "Stuff Rate",
    abbr: "Stuff %",
    description:
      "Percentage of rushing attempts stopped at or behind the line of scrimmage.",
  },
  rush_10_plus_rate: {
    label: "10+ Yard Rush Rate",
    abbr: "10+ %",
    description:
      "Percentage of rushing attempts that gained 10 or more yards.",
  },
  rush_20_plus_rate: {
    label: "20+ Yard Rush Rate",
    abbr: "20+ %",
    description:
      "Percentage of rushing attempts that gained 20 or more yards.",
  },

  // ── Scrambling (QB only) ──────────────────────────────────────────
  qb_scramble_attempts: {
    label: "Scramble Attempts",
    abbr: "Scramble Att",
    description:
      "Total number of designed or improvised quarterback scrambles, where the QB ran outside the pocket on a designed pass play.",
  },
  qb_scramble_yards: {
    label: "Scramble Yards",
    abbr: "Scramble Yds",
    description: "Total yards gained on quarterback scrambles.",
  },
  qb_scramble_tds: {
    label: "Scramble Touchdowns",
    abbr: "Scramble TD",
    description: "Total touchdowns scored on quarterback scrambles.",
  },
  qb_scramble_yards_per_carry: {
    label: "Scramble Yards per Carry",
    abbr: "Scramble Yds/Carry",
    description: "Average yards gained per quarterback scramble.",
  },
  qb_scramble_yards_per_game: {
    label: "Scramble Yards per Game",
    abbr: "Scramble Yds/Game",
    description: "Average scramble yards per game played.",
  },
  qb_scramble_epa_total: {
    label: "Scramble EPA",
    abbr: "Scramble EPA",
    description:
      "Expected Points Added on all quarterback scramble plays.",
  },
  qb_scramble_epa_per_carry: {
    label: "Scramble EPA per Carry",
    abbr: "Scramble EPA/Carry",
    description:
      "Expected Points Added per quarterback scramble attempt.",
  },
  qb_scramble_success_total: {
    label: "Scramble Successful Plays",
    abbr: "Scramble Success",
    description:
      "Total number of quarterback scrambles considered successful (gained positive EPA).",
  },
  qb_scramble_success_rate: {
    label: "Scramble Success Rate",
    abbr: "Scramble Success %",
    description:
      "Percentage of quarterback scrambles that were successful.",
  },

  // ── Receiving ─────────────────────────────────────────────────────
  rec_targets: {
    label: "Targets",
    abbr: "Targets",
    description:
      "Total number of times the receiver was the intended target of a pass attempt.",
  },
  rec_receptions: {
    label: "Receptions",
    abbr: "Rec",
    description: "Total number of passes caught.",
  },
  rec_yards: {
    label: "Receiving Yards",
    abbr: "Yards",
    description:
      "Total yards gained on receptions, including both air yards and yards after catch.",
  },
  rec_touchdowns: {
    label: "Receiving Touchdowns",
    abbr: "TD",
    description: "Total number of receiving touchdowns.",
  },
  rec_catch_rate: {
    label: "Catch Rate",
    abbr: "Catch %",
    description:
      "Percentage of targets that resulted in a reception. Calculated as receptions divided by targets.",
  },
  rec_yards_per_reception: {
    label: "Yards per Reception",
    abbr: "Yds/Rec",
    description: "Average yards gained per reception.",
  },
  rec_yards_per_target: {
    label: "Yards per Target",
    abbr: "Yds/Tgt",
    description: "Average yards gained per target, including incompletions.",
  },
  rec_yards_per_game: {
    label: "Receiving Yards per Game",
    abbr: "Yds/Game",
    description: "Average receiving yards per game played.",
  },
  rec_long: {
    label: "Longest Reception",
    abbr: "Long",
    description: "Longest reception in yards during the selected period.",
  },
  rec_first_downs: {
    label: "Receiving First Downs",
    abbr: "1st Downs",
    description:
      "Total number of first downs earned through receptions.",
  },
  rec_20_plus: {
    label: "20+ Yard Receptions",
    abbr: "20+",
    description:
      "Total number of receptions that gained 20 or more yards.",
  },
  rec_air_yards_total: {
    label: "Receiver Air Yards",
    abbr: "Air Yds",
    description:
      "Total distance in yards the ball traveled in the air on passes targeted at this receiver.",
  },
  rec_yac_total: {
    label: "Yards After Catch",
    abbr: "YAC",
    description:
      "Total yards gained by the receiver after the point of catch.",
  },
  rec_fumbles: {
    label: "Receiving Fumbles",
    abbr: "Fumbles",
    description: "Total number of fumbles after a reception.",
  },
  rec_fumbles_lost: {
    label: "Receiving Fumbles Lost",
    abbr: "Fum Lost",
    description:
      "Total number of fumbles after a reception that were recovered by the opposing team.",
  },

  // ── Advanced Receiving ────────────────────────────────────────────
  rec_epa_total: {
    label: "Receiving EPA",
    abbr: "EPA",
    description:
      "Expected Points Added on all plays where this receiver was targeted.",
  },
  rec_epa_per_target: {
    label: "Receiving EPA per Target",
    abbr: "EPA/Tgt",
    description:
      "Expected Points Added per target. Measures average value generated per look.",
  },
  rec_epa_per_reception: {
    label: "Receiving EPA per Reception",
    abbr: "EPA/Rec",
    description: "Expected Points Added per reception.",
  },
  rec_success_total: {
    label: "Receiving Successful Plays",
    abbr: "Success",
    description:
      "Total number of receiving plays considered successful (gained positive EPA).",
  },
  rec_success_rate: {
    label: "Receiving Success Rate",
    abbr: "Success %",
    description:
      "Percentage of targeted plays that were successful (gained positive EPA).",
  },
  rec_touchdown_rate: {
    label: "Receiving Touchdown Rate",
    abbr: "TD %",
    description:
      "Percentage of receptions that resulted in a touchdown.",
  },
  rec_first_down_rate: {
    label: "Receiving First Down Rate",
    abbr: "1st Down %",
    description:
      "Percentage of receptions that resulted in a first down.",
  },
  rec_20_plus_rate: {
    label: "20+ Yard Reception Rate",
    abbr: "20+ %",
    description:
      "Percentage of receptions that gained 20 or more yards.",
  },
  rec_air_yards_per_target: {
    label: "Air Yards per Target",
    abbr: "Air Yds/Tgt",
    description:
      "Average air yards per target. Indicates average throw depth when targeted.",
  },
  rec_air_yards_per_reception: {
    label: "Air Yards per Reception",
    abbr: "Air Yds/Rec",
    description:
      "Average air yards per reception.",
  },
  rec_air_yard_percent: {
    label: "Air Yard Percentage",
    abbr: "Air Yd %",
    description:
      "Percentage of total receiving yards that came through the air (before the catch) versus after the catch.",
  },
  rec_yac_per_reception: {
    label: "YAC per Reception",
    abbr: "YAC/Rec",
    description:
      "Average yards after catch per reception. Higher values indicate a receiver who creates yards after the catch.",
  },
  rec_yac_percent: {
    label: "YAC Percentage",
    abbr: "YAC %",
    description:
      "Percentage of total receiving yards that came after the catch.",
  },

  // ── Overview / Totals ─────────────────────────────────────────────
  total_plays: {
    label: "Total Plays",
    abbr: "Total Plays",
    description:
      "Total number of offensive plays (pass attempts + rush attempts + sacks).",
  },
  total_yards: {
    label: "Total Yards",
    abbr: "Total Yards",
    description:
      "Total yards gained across all play types (passing + rushing).",
  },
  total_touchdowns: {
    label: "Total Touchdowns",
    abbr: "Total TD",
    description:
      "Total touchdowns scored across all play types.",
  },
  total_first_downs: {
    label: "Total First Downs",
    abbr: "Total 1st Downs",
    description:
      "Total first downs earned across passing, rushing, and receiving.",
  },
  total_fumbles: {
    label: "Total Fumbles",
    abbr: "Total Fumbles",
    description: "Total fumbles across all play types.",
  },
  total_fumbles_lost: {
    label: "Total Fumbles Lost",
    abbr: "Total Fum Lost",
    description:
      "Total fumbles recovered by the opposing team across all play types.",
  },
  total_yards_per_play: {
    label: "Total Yards per Play",
    abbr: "Yds/Play",
    description: "Average yards gained per offensive play.",
  },
  total_yards_per_game: {
    label: "Total Yards per Game",
    abbr: "Yds/Game",
    description: "Average total yards per game played.",
  },
  total_epa: {
    label: "Total EPA",
    abbr: "Total EPA",
    description:
      "Expected Points Added across all play types. The most comprehensive measure of offensive production.",
  },
  total_epa_per_play: {
    label: "Total EPA per Play",
    abbr: "EPA/Play",
    description:
      "Expected Points Added per play across all play types. The most comprehensive per-play efficiency measure.",
  },
  total_success_plays: {
    label: "Total Successful Plays",
    abbr: "Success Plays",
    description:
      "Total number of plays considered successful across all play types.",
  },
  total_success_rate: {
    label: "Total Success Rate",
    abbr: "Success %",
    description:
      "Percentage of all plays that were successful (gained positive EPA).",
  },

  // ── Scrimmage & Fantasy ───────────────────────────────────────────
  ppr_points: {
    label: "PPR Fantasy Points",
    abbr: "PPR Points",
    description:
      "Fantasy football points scored in a PPR (Point Per Reception) scoring format. Awards 1 point per reception plus standard scoring for yards and touchdowns.",
  },
  scrim_touches: {
    label: "Scrimmage Touches",
    abbr: "Scrim Touches",
    description:
      "Total touches from scrimmage (rush attempts + receptions).",
  },
  scrim_yards: {
    label: "Scrimmage Yards",
    abbr: "Scrim Yards",
    description:
      "Total yards from scrimmage (rushing yards + receiving yards).",
  },
  scrim_touchdowns: {
    label: "Scrimmage Touchdowns",
    abbr: "Scrim TD",
    description:
      "Total touchdowns from scrimmage (rushing + receiving touchdowns).",
  },
  scrim_first_downs: {
    label: "Scrimmage First Downs",
    abbr: "Scrim 1st Downs",
    description:
      "Total first downs from scrimmage (rushing + receiving first downs).",
  },
  scrim_yards_per_touch: {
    label: "Scrimmage Yards per Touch",
    abbr: "Scrim Yds/Touch",
    description:
      "Average scrimmage yards gained per touch (carry or reception).",
  },
  scrim_yards_per_game: {
    label: "Scrimmage Yards per Game",
    abbr: "Scrim Yds/Game",
    description: "Average scrimmage yards per game played.",
  },
  scrim_epa_total: {
    label: "Scrimmage EPA",
    abbr: "Scrim EPA",
    description:
      "Expected Points Added on all scrimmage plays (rushing + receiving).",
  },
  scrim_epa_per_play: {
    label: "Scrimmage EPA per Play",
    abbr: "Scrim EPA/Play",
    description:
      "Expected Points Added per scrimmage play.",
  },
  scrim_success_total: {
    label: "Scrimmage Successful Plays",
    abbr: "Scrim Success",
    description:
      "Total number of scrimmage plays considered successful.",
  },
  scrim_success_rate: {
    label: "Scrimmage Success Rate",
    abbr: "Scrim Success %",
    description:
      "Percentage of scrimmage plays that were successful.",
  },

  // ── Team Overview ─────────────────────────────────────────────────
  plays_total: {
    label: "Total Plays",
    abbr: "Plays",
    description: "Total number of offensive or defensive plays.",
  },
  drives_total: {
    label: "Total Drives",
    abbr: "Drives",
    description: "Total number of offensive or defensive drives.",
  },
  yards_total: {
    label: "Total Yards",
    abbr: "Yards",
    description: "Total yards gained or allowed.",
  },
  points_total: {
    label: "Total Points",
    abbr: "Points",
    description: "Total points scored or allowed.",
  },
  touchdowns: {
    label: "Touchdowns",
    abbr: "TD",
    description: "Total touchdowns scored or allowed.",
  },
  first_downs: {
    label: "First Downs",
    abbr: "1st Downs",
    description: "Total first downs earned or allowed.",
  },
  fumbles: {
    label: "Fumbles",
    abbr: "Fumbles",
    description: "Total fumbles committed or forced.",
  },
  fumbles_lost: {
    label: "Fumbles Lost",
    abbr: "Fum Lost",
    description: "Total fumbles lost or recovered.",
  },
  turnovers: {
    label: "Turnovers",
    abbr: "Turnovers",
    description:
      "Total turnovers (interceptions thrown + fumbles lost) committed or forced.",
  },
  explosive_plays: {
    label: "Explosive Plays",
    abbr: "Explosive",
    description:
      "Total explosive plays — rushing gains of 10+ yards or passing gains of 20+ yards.",
  },

  // ── Team Efficiency ───────────────────────────────────────────────
  yards_per_game: {
    label: "Yards per Game",
    abbr: "Yds/Game",
    description: "Average total yards per game.",
  },
  yards_per_play: {
    label: "Yards per Play",
    abbr: "Yds/Play",
    description: "Average yards gained per play.",
  },
  yards_per_drive: {
    label: "Yards per Drive",
    abbr: "Yds/Drive",
    description: "Average yards gained per drive.",
  },
  points_per_game: {
    label: "Points per Game",
    abbr: "Pts/Game",
    description: "Average points scored per game.",
  },
  points_per_play: {
    label: "Points per Play",
    abbr: "Pts/Play",
    description: "Average points generated per play.",
  },
  points_per_drive: {
    label: "Points per Drive",
    abbr: "Pts/Drive",
    description: "Average points scored per drive.",
  },
  epa: {
    label: "Total EPA",
    abbr: "EPA",
    description:
      "Expected Points Added across all plays. Measures total value added above expectation.",
  },
  epa_per_game: {
    label: "EPA per Game",
    abbr: "EPA/Game",
    description: "Average Expected Points Added per game.",
  },
  epa_per_play: {
    label: "EPA per Play",
    abbr: "EPA/Play",
    description:
      "Expected Points Added per play. The most widely used single-number efficiency metric in modern NFL analytics.",
  },
  epa_per_drive: {
    label: "EPA per Drive",
    abbr: "EPA/Drive",
    description: "Average Expected Points Added per drive.",
  },
  success_total: {
    label: "Successful Plays",
    abbr: "Success",
    description: "Total number of plays considered successful (gained positive EPA).",
  },
  success_rate: {
    label: "Success Rate",
    abbr: "Success %",
    description:
      "Percentage of plays that were successful. Success rate is considered more stable than EPA for evaluating consistency.",
  },
  explosive_play_rate: {
    label: "Explosive Play Rate",
    abbr: "Explosive %",
    description:
      "Percentage of plays that were explosive (10+ yard rush or 20+ yard pass).",
  },

  // ── Situational ───────────────────────────────────────────────────
  third_down_attempts: {
    label: "Third Down Attempts",
    abbr: "3rd Down Att",
    description: "Total number of third down plays.",
  },
  third_down_conversions: {
    label: "Third Down Conversions",
    abbr: "3rd Down Conv",
    description:
      "Total number of third down plays that resulted in a first down or touchdown.",
  },
  third_down_conversion_rate: {
    label: "Third Down Conversion Rate",
    abbr: "3rd Down %",
    description:
      "Percentage of third down attempts that were converted into first downs or touchdowns.",
  },
  fourth_down_attempts: {
    label: "Fourth Down Attempts",
    abbr: "4th Down Att",
    description: "Total number of fourth down plays (excluding punts and field goals).",
  },
  fourth_down_conversions: {
    label: "Fourth Down Conversions",
    abbr: "4th Down Conv",
    description:
      "Total number of fourth down plays that resulted in a first down or touchdown.",
  },
  fourth_down_conversion_rate: {
    label: "Fourth Down Conversion Rate",
    abbr: "4th Down %",
    description:
      "Percentage of fourth down attempts that were converted.",
  },
  three_and_outs: {
    label: "Three-and-Outs",
    abbr: "3-and-Outs",
    description:
      "Total number of drives that ended in a punt after three plays without gaining a first down.",
  },
  three_and_out_rate: {
    label: "Three-and-Out Rate",
    abbr: "3-and-Out %",
    description:
      "Percentage of drives that ended in a three-and-out.",
  },
  early_down_total: {
    label: "Early Down Plays",
    abbr: "Early Down Plays",
    description:
      "Total number of plays on early downs (1st and 2nd down).",
  },
  early_down_epa: {
    label: "Early Down EPA",
    abbr: "Early Down EPA",
    description:
      "Expected Points Added on early down plays (1st and 2nd down).",
  },
  early_down_epa_per_play: {
    label: "Early Down EPA per Play",
    abbr: "Early Down EPA/Play",
    description:
      "Expected Points Added per early down play. Measures efficiency on the downs where game script is most neutral.",
  },
  early_down_success: {
    label: "Early Down Successful Plays",
    abbr: "Early Down Success",
    description:
      "Total number of early down plays considered successful.",
  },
  early_down_success_rate: {
    label: "Early Down Success Rate",
    abbr: "Early Down Success %",
    description:
      "Percentage of early down plays that were successful. Often considered the best measure of sustainable offensive or defensive performance.",
  },
  late_down_total: {
    label: "Late Down Plays",
    abbr: "Late Down Plays",
    description:
      "Total number of plays on late downs (3rd and 4th down).",
  },
  late_down_epa: {
    label: "Late Down EPA",
    abbr: "Late Down EPA",
    description:
      "Expected Points Added on late down plays (3rd and 4th down).",
  },
  late_down_epa_per_play: {
    label: "Late Down EPA per Play",
    abbr: "Late Down EPA/Play",
    description:
      "Expected Points Added per late down play.",
  },
  late_down_success: {
    label: "Late Down Successful Plays",
    abbr: "Late Down Success",
    description:
      "Total number of late down plays considered successful.",
  },
  late_down_success_rate: {
    label: "Late Down Success Rate",
    abbr: "Late Down Success %",
    description:
      "Percentage of late down plays that were successful.",
  },
};

// ── Lookup helpers ──────────────────────────────────────────────────

/**
 * Look up a stat definition by key.
 * Strips off_/def_ prefixes for team stats.
 */
export function getStatDefinition(key: string): StatDefinition | undefined {
  if (STAT_DEFINITIONS[key]) return STAT_DEFINITIONS[key];
  const stripped = key.replace(/^(off|def)_/, "");
  return STAT_DEFINITIONS[stripped];
}

/** Get description string for a key, or undefined. */
export function getStatDescription(key: string): string | undefined {
  return getStatDefinition(key)?.description;
}

/** Display label with (Off)/(Def) suffix for team stat keys. */
export function getStatDisplayLabel(key: string): string {
  const def = getStatDefinition(key);
  const base = def?.label ?? key;
  if (key.startsWith("off_")) return `${base} (Off)`;
  if (key.startsWith("def_")) return `${base} (Def)`;
  return base;
}

// ── Glossary page categories ────────────────────────────────────────

export const GLOSSARY_CATEGORIES: GlossaryCategory[] = [
  {
    title: "General",
    description: "General game and record statistics.",
    stats: ["games_played", "record", "win_percentage"],
  },
  {
    title: "Passing",
    description: "Traditional passing statistics.",
    stats: [
      "pass_attempts",
      "pass_completions",
      "pass_yards",
      "pass_touchdowns",
      "pass_ints",
      "pass_rating",
      "pass_comp_percent",
      "pass_yards_per_attempt",
      "pass_yards_per_completion",
      "pass_yards_per_game",
      "pass_sacks",
      "pass_sack_yards",
      "pass_qb_hit",
      "pass_qb_dropbacks",
      "pass_first_downs",
      "pass_20_plus",
      "pass_long",
      "pass_air_yards",
      "pass_yac_total",
    ],
  },
  {
    title: "Advanced Passing",
    description: "EPA, CPOE, and efficiency metrics for the passing game.",
    stats: [
      "pass_epa",
      "pass_epa_per_attempt",
      "pass_epa_per_completion",
      "pass_epa_per_dropback",
      "pass_cpoe",
      "pass_cpoe_total",
      "pass_success_total",
      "pass_success_rate",
      "pass_td_percent",
      "pass_int_percent",
      "pass_sack_percent",
      "pass_qb_hit_percent",
      "pass_first_down_rate",
      "pass_20_plus_rate",
      "pass_average_depth_of_target",
      "pass_air_yards_per_attempt",
      "pass_air_yards_per_completion",
      "pass_yac_per_attempt",
      "pass_yac_per_completion",
    ],
  },
  {
    title: "Rushing",
    description: "Traditional rushing statistics.",
    stats: [
      "rush_attempts",
      "rush_yards",
      "rush_touchdowns",
      "rush_yards_per_carry",
      "rush_yards_per_game",
      "rush_long",
      "rush_first_downs",
      "rush_stuffs",
      "rush_10_plus",
      "rush_20_plus",
      "rush_fumbles",
      "rush_fumbles_lost",
    ],
  },
  {
    title: "Advanced Rushing",
    description: "EPA and efficiency metrics for the rushing game.",
    stats: [
      "rush_epa_total",
      "rush_epa_per_attempt",
      "rush_success_total",
      "rush_success_rate",
      "rush_touchdown_rate",
      "rush_stuff_rate",
      "rush_10_plus_rate",
      "rush_20_plus_rate",
    ],
  },
  {
    title: "Scrambling",
    description:
      "QB scramble statistics — quarterback rushing plays outside the pocket on designed pass plays.",
    stats: [
      "qb_scramble_attempts",
      "qb_scramble_yards",
      "qb_scramble_tds",
      "qb_scramble_yards_per_carry",
      "qb_scramble_yards_per_game",
      "qb_scramble_epa_total",
      "qb_scramble_epa_per_carry",
      "qb_scramble_success_total",
      "qb_scramble_success_rate",
    ],
  },
  {
    title: "Receiving",
    description: "Traditional receiving statistics.",
    stats: [
      "rec_targets",
      "rec_receptions",
      "rec_yards",
      "rec_touchdowns",
      "rec_catch_rate",
      "rec_yards_per_reception",
      "rec_yards_per_target",
      "rec_yards_per_game",
      "rec_long",
      "rec_first_downs",
      "rec_20_plus",
      "rec_air_yards_total",
      "rec_yac_total",
      "rec_fumbles",
      "rec_fumbles_lost",
    ],
  },
  {
    title: "Advanced Receiving",
    description: "EPA and efficiency metrics for the receiving game.",
    stats: [
      "rec_epa_total",
      "rec_epa_per_target",
      "rec_epa_per_reception",
      "rec_success_total",
      "rec_success_rate",
      "rec_touchdown_rate",
      "rec_first_down_rate",
      "rec_20_plus_rate",
      "rec_air_yards_per_target",
      "rec_air_yards_per_reception",
      "rec_air_yard_percent",
      "rec_yac_per_reception",
      "rec_yac_percent",
    ],
  },
  {
    title: "Overview & Totals",
    description: "Combined totals across all play types (player stats).",
    stats: [
      "total_plays",
      "total_yards",
      "total_touchdowns",
      "total_first_downs",
      "total_fumbles",
      "total_fumbles_lost",
      "total_yards_per_play",
      "total_yards_per_game",
      "total_epa",
      "total_epa_per_play",
      "total_success_plays",
      "total_success_rate",
    ],
  },
  {
    title: "Scrimmage & Fantasy",
    description:
      "Scrimmage totals (rushing + receiving) and fantasy scoring.",
    stats: [
      "ppr_points",
      "scrim_touches",
      "scrim_yards",
      "scrim_touchdowns",
      "scrim_first_downs",
      "scrim_yards_per_touch",
      "scrim_yards_per_game",
      "scrim_epa_total",
      "scrim_epa_per_play",
      "scrim_success_total",
      "scrim_success_rate",
    ],
  },
  {
    title: "Team Overview",
    description:
      "Team-level totals for offensive and defensive production.",
    stats: [
      "plays_total",
      "drives_total",
      "yards_total",
      "points_total",
      "touchdowns",
      "first_downs",
      "fumbles",
      "fumbles_lost",
      "turnovers",
      "explosive_plays",
    ],
  },
  {
    title: "Team Efficiency",
    description:
      "Per-game, per-play, and per-drive efficiency metrics used in both offensive and defensive contexts.",
    stats: [
      "yards_per_game",
      "yards_per_play",
      "yards_per_drive",
      "points_per_game",
      "points_per_play",
      "points_per_drive",
      "epa",
      "epa_per_game",
      "epa_per_play",
      "epa_per_drive",
      "success_total",
      "success_rate",
      "explosive_play_rate",
    ],
  },
  {
    title: "Situational",
    description: "Down-specific conversion and efficiency metrics.",
    stats: [
      "third_down_attempts",
      "third_down_conversions",
      "third_down_conversion_rate",
      "fourth_down_attempts",
      "fourth_down_conversions",
      "fourth_down_conversion_rate",
      "three_and_outs",
      "three_and_out_rate",
      "early_down_total",
      "early_down_epa",
      "early_down_epa_per_play",
      "early_down_success",
      "early_down_success_rate",
      "late_down_total",
      "late_down_epa",
      "late_down_epa_per_play",
      "late_down_success",
      "late_down_success_rate",
    ],
  },
];
