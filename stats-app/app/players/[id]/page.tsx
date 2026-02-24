import Image from "next/image";
import { notFound } from "next/navigation";
import { queryOne } from "@/lib/db";
import { searchParamsCache } from "@/lib/filters/search-params";
import { filterSchema, toDbParams } from "@/lib/filters/validation";
import { PlayerStatsDisplay } from "@/components/players/PlayerStatsDisplay";
import type { Player, PlayerStats } from "@/lib/types";

export default async function PlayerDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const filters = await searchParamsCache.parse(searchParams);

  const player = await queryOne<Player>(
    "SELECT player_id, first_name, last_name, first_season, last_season, headshot_url FROM players WHERE player_id = $1",
    [id]
  );

  if (!player) {
    notFound();
  }

  const validated = filterSchema.parse(filters);
  const db = toDbParams(validated);

  const [stats, positionRow] = await Promise.all([
    queryOne<PlayerStats>(
      "SELECT * FROM player_stats($1, $2, $3, $4, $5, $6)",
      [id, db.seasonStart, db.seasonEnd, db.weekStart, db.weekEnd, db.seasonType]
    ),
    queryOne<{ position: string }>(
      "SELECT position FROM player_week WHERE player_id = $1 ORDER BY season DESC, week DESC LIMIT 1",
      [id]
    ),
  ]);

  const position = positionRow?.position ?? "QB";

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        {player.headshot_url && (
          <Image
            src={player.headshot_url}
            alt={`${player.first_name} ${player.last_name}`}
            width={96}
            height={96}
            className="rounded-full bg-foreground/5"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {player.first_name} {player.last_name}
          </h1>
          <p className="mt-1 text-sm text-foreground/50">
            {position} &middot; Seasons {player.first_season}&ndash;{player.last_season}
          </p>
        </div>
      </div>

      {stats && stats.games_played > 0 ? (
        <PlayerStatsDisplay stats={stats} position={position} />
      ) : (
        <div className="rounded-lg border border-foreground/10 p-6">
          <p className="text-foreground/50">
            No stats found for the selected date range.
          </p>
        </div>
      )}
    </div>
  );
}
