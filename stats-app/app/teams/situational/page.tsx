import { searchParamsCache } from "@/lib/filters/search-params";
import { filterSchema, toDbParams } from "@/lib/filters/validation";
import { TeamStatsPageClient } from "@/components/teams/TeamStatsPageClient";
import { getAllTeamStats } from "@/lib/cached-queries";

export default async function TeamSituationalPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = await searchParamsCache.parse(searchParams);
  const validated = filterSchema.parse(filters);
  const db = toDbParams(validated);

  const teams = await getAllTeamStats(
    db.seasonStart, db.seasonEnd, db.weekStart, db.weekEnd, db.seasonType
  );

  return (
    <TeamStatsPageClient
      teams={teams}
      title="Team Situational Stats"
      category="situational"
    />
  );
}
