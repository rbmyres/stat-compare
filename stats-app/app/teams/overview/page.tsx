import { query } from "@/lib/db";
import { searchParamsCache } from "@/lib/filters/search-params";
import { filterSchema, toDbParams } from "@/lib/filters/validation";
import { TeamStatsPageClient } from "@/components/teams/TeamStatsPageClient";
import type { TeamStats } from "@/lib/types/team-stats";

export default async function TeamOverviewPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = await searchParamsCache.parse(searchParams);
  const validated = filterSchema.parse(filters);
  const db = toDbParams(validated);

  const teams = await query<TeamStats>(
    "SELECT * FROM team_stats($1, $2, $3, $4, $5, $6)",
    [null, db.seasonStart, db.seasonEnd, db.weekStart, db.weekEnd, db.seasonType]
  );

  return (
    <TeamStatsPageClient
      teams={teams}
      title="Team Overview Stats"
      category="overview"
    />
  );
}
