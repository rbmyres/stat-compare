import { notFound } from "next/navigation";
import { queryOne } from "@/lib/db";
import type { Player } from "@/lib/types";

export default async function PlayerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const player = await queryOne<Player>(
    "SELECT player_id, first_name, last_name, first_season, last_season FROM players WHERE player_id = $1",
    [id]
  );

  if (!player) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">
        {player.first_name} {player.last_name}
      </h1>
      <p className="mt-2 text-foreground/60">
        Seasons {player.first_season}&ndash;{player.last_season}
      </p>
      <div className="mt-8 rounded-lg border border-foreground/10 p-6">
        <p className="text-foreground/50">
          Detailed player statistics coming soon.
        </p>
      </div>
    </div>
  );
}
