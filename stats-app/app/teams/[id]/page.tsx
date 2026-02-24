import Image from "next/image";
import { notFound } from "next/navigation";
import { queryOne } from "@/lib/db";
import { searchParamsCache } from "@/lib/filters/search-params";
import { filterSchema, toDbParams } from "@/lib/filters/validation";
import { TeamStatsDisplay } from "@/components/teams/TeamStatsDisplay";
import type { Team, TeamStats } from "@/lib/types";

export default async function TeamDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const filters = await searchParamsCache.parse(searchParams);

  const team = await queryOne<Team>(
    "SELECT team_id, abbr, display_name, nickname, primary_color, logo_url FROM teams WHERE team_id = $1",
    [id]
  );

  if (!team) {
    notFound();
  }

  const validated = filterSchema.parse(filters);
  const db = toDbParams(validated);

  const stats = await queryOne<TeamStats>(
    "SELECT * FROM team_stats($1, $2, $3, $4, $5, $6)",
    [id, db.seasonStart, db.seasonEnd, db.weekStart, db.weekEnd, db.seasonType]
  );

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        {team.logo_url && (
          <Image
            src={team.logo_url}
            alt={team.display_name}
            width={72}
            height={72}
            className="object-contain"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {team.display_name}
          </h1>
          <p className="mt-1 text-sm text-foreground/50">
            {team.nickname}
          </p>
        </div>
      </div>

      {stats && Number(stats.games_played) > 0 ? (
        <TeamStatsDisplay stats={stats} />
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
