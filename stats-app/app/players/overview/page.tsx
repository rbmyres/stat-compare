import { query } from "@/lib/db";
import { searchParamsCache } from "@/lib/filters/search-params";
import { filterSchema, toDbParams } from "@/lib/filters/validation";
import { StatsPageClient } from "@/components/players/StatsPageClient";
import type { PlayerStats } from "@/lib/types/player-stats";

export default async function OverviewPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = await searchParamsCache.parse(searchParams);
  const validated = filterSchema.parse(filters);
  const db = toDbParams(validated);

  const players = await query<PlayerStats>(
    "SELECT * FROM player_stats($1, $2, $3, $4, $5, $6)",
    [null, db.seasonStart, db.seasonEnd, db.weekStart, db.weekEnd, db.seasonType]
  );

  return (
    <StatsPageClient
      players={players}
      title="Overview Stats"
      category="overview"
    />
  );
}
