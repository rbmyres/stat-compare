export interface Player {
  player_id: string;
  first_name: string;
  last_name: string;
  first_season: number;
  last_season: number;
}

export interface Team {
  team_id: string;
  abbr: string;
  display_name: string;
  nickname: string;
  primary_color: string;
}

export interface SearchResult {
  type: "player" | "team";
  id: string;
  name: string;
  subtitle: string;
}
