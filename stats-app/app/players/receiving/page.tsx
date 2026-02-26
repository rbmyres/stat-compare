import { searchParamsCache } from "@/lib/filters/search-params";
import { filterSchema, toDbParams } from "@/lib/filters/validation";
import { StatsPageClient } from "@/components/players/StatsPageClient";
import { getAllPlayerStats } from "@/lib/cached-queries";

export default async function ReceivingPage({
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

  const players = allPlayers.filter((p) => Number(p.rec_targets) > 0);

  return (
    <StatsPageClient
      players={players}
      title="Receiving Stats"
      category="receiving"
    />
  );
}
