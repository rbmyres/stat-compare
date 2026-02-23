import { notFound } from "next/navigation";
import { queryOne } from "@/lib/db";
import type { Team } from "@/lib/types";

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const team = await queryOne<Team>(
    "SELECT team_id, abbr, display_name, nickname, primary_color FROM teams WHERE team_id = $1",
    [id]
  );

  if (!team) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">
        {team.display_name}
      </h1>
      <p className="mt-2 text-foreground/60">{team.nickname}</p>
      <div className="mt-8 rounded-lg border border-foreground/10 p-6">
        <p className="text-foreground/50">
          Detailed team statistics coming soon.
        </p>
      </div>
    </div>
  );
}
