import { searchParamsCache } from "@/lib/filters/search-params";
import { filterSchema, toDbParams } from "@/lib/filters/validation";
import { StatsPageClient } from "@/components/players/StatsPageClient";
import { getAllPlayerStats } from "@/lib/cached-queries";

export default async function RushingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = await searchParamsCache.parse(searchParams);
  const validated = filterSchema.parse(filters);
  const db = toDbParams(validated);

  const allPlayers = await getAllPlayerStats(
    db.seasonStart, db.seasonEnd, db.weekStart, db.weekEnd, db.seasonType
  );

  const players = allPlayers.filter((p) => Number(p.rush_attempts) > 0);

  return (
    <StatsPageClient
      players={players}
      title="Rushing Stats"
      category="rushing"
    />
  );
}
