import { searchParamsCache } from "@/lib/filters/search-params";
import { filterSchema, toDbParams } from "@/lib/filters/validation";
import { queryOne } from "@/lib/db";
import { CompareClient } from "@/components/compare/CompareClient";
import type { CompareEntity } from "@/components/compare/EntitySelector";
import type { Player, Team } from "@/lib/types";

function parseIds(raw: string | string[] | undefined): string[] {
  if (!raw) return [];
  const str = Array.isArray(raw) ? raw[0] : raw;
  return str ? str.split(",").filter(Boolean).slice(0, 4) : [];
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const filters = await searchParamsCache.parse(searchParams);

  const modeRaw = Array.isArray(sp.mode) ? sp.mode[0] : sp.mode;
  const mode = modeRaw === "team" ? "team" : "player";
  const ids = parseIds(sp.ids);

  let entities: CompareEntity[] = [];
  let entityStats: Record<string, Record<string, unknown>> = {};

  if (ids.length > 0) {
    const validated = filterSchema.parse(filters);
    const db = toDbParams(validated);

    if (mode === "player") {
      const results = await Promise.all(
        ids.map(async (id) => {
          const [player, stats] = await Promise.all([
            queryOne<Player>(
              "SELECT player_id, first_name, last_name, first_season, last_season, headshot_url FROM players WHERE player_id = $1",
              [id]
            ),
            queryOne<Record<string, unknown>>(
              "SELECT * FROM player_stats($1, $2, $3, $4, $5, $6)",
              [
                id,
                db.seasonStart,
                db.seasonEnd,
                db.weekStart,
                db.weekEnd,
                db.seasonType,
              ]
            ),
          ]);
          return { player, stats };
        })
      );

      for (const { player, stats } of results) {
        if (!player || !stats) continue;
        entities.push({
          id: player.player_id,
          name: `${player.first_name} ${player.last_name}`,
          subtitle:
            player.first_season === player.last_season
              ? `${player.first_season}`
              : `${player.first_season}\u2013${player.last_season}`,
          image_url: player.headshot_url ?? undefined,
        });
        entityStats[player.player_id] = stats;
      }
    } else {
      const results = await Promise.all(
        ids.map(async (id) => {
          const [team, stats] = await Promise.all([
            queryOne<Team>(
              "SELECT team_id, abbr, display_name, nickname, primary_color, logo_url FROM teams WHERE team_id = $1",
              [id]
            ),
            queryOne<Record<string, unknown>>(
              "SELECT * FROM team_stats($1, $2, $3, $4, $5, $6)",
              [
                id,
                db.seasonStart,
                db.seasonEnd,
                db.weekStart,
                db.weekEnd,
                db.seasonType,
              ]
            ),
          ]);
          return { team, stats };
        })
      );

      for (const { team, stats } of results) {
        if (!team || !stats) continue;
        entities.push({
          id: team.team_id,
          name: team.display_name,
          subtitle: team.nickname,
          image_url: team.logo_url ?? undefined,
        });
        entityStats[team.team_id] = stats;
      }
    }
  }

  return (
    <CompareClient initialEntities={entities} entityStats={entityStats} />
  );
}
