"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { PlayerStats } from "@/lib/types/player-stats";
import type { ColumnDef } from "@/lib/columns";
import { num } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

interface SortableStatsTableProps {
  players: PlayerStats[];
  columns: ColumnDef[];
}

export function SortableStatsTable({ players, columns }: SortableStatsTableProps) {
  const [sortKey, setSortKey] = useState<keyof PlayerStats | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  function handleSort(key: keyof PlayerStats) {
    if (sortKey === key) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const sorted = useMemo(() => {
    if (!sortKey) return players;
    return [...players].sort((a, b) => {
      const aRaw = a[sortKey];
      const bRaw = b[sortKey];

      // String fields (like record)
      if (typeof aRaw === "string" && typeof bRaw === "string") {
        return sortDir === "asc"
          ? aRaw.localeCompare(bRaw)
          : bRaw.localeCompare(aRaw);
      }

      const aVal = num(aRaw);
      const bVal = num(bRaw);
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    });
  }, [players, sortKey, sortDir]);

  return (
    <div className="overflow-x-auto rounded-md border border-foreground/[0.06]">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-foreground/[0.025]">
            {/* Rank column */}
            <th className="sticky left-0 z-20 whitespace-nowrap border-b border-r border-foreground/[0.06] bg-foreground/[0.025] px-2 py-1.5 text-center text-[9px] font-semibold uppercase tracking-[0.06em] text-foreground/35">
              #
            </th>

            {/* Player name column */}
            <th className="sticky left-[29px] z-20 whitespace-nowrap border-b border-r border-foreground/[0.06] bg-foreground/[0.025] px-3 py-1.5 text-left text-[9px] font-semibold uppercase tracking-[0.06em] text-foreground/35">
              Player
            </th>

            {/* Stat columns */}
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => handleSort(col.key)}
                className={cn(
                  "cursor-pointer select-none whitespace-nowrap border-b border-foreground/[0.06] px-3 py-1.5 text-left text-[9px] font-semibold uppercase tracking-[0.06em] transition-colors hover:text-foreground/60",
                  sortKey === col.key
                    ? "text-nfl-navy"
                    : "text-foreground/35"
                )}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {sortKey === col.key && (
                    <span className="text-[8px]">
                      {sortDir === "desc" ? "\u25BC" : "\u25B2"}
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((player, i) => (
            <tr
              key={player.player_id}
              className="transition-colors even:bg-foreground/[0.015] hover:bg-foreground/[0.04]"
            >
              {/* Rank */}
              <td className="sticky left-0 z-10 whitespace-nowrap border-r border-foreground/[0.06] bg-inherit px-2 py-2 text-center font-mono text-[12px] text-foreground/30">
                {i + 1}
              </td>

              {/* Player name */}
              <td className="sticky left-[29px] z-10 whitespace-nowrap border-r border-foreground/[0.06] bg-inherit px-3 py-2">
                <Link
                  href={`/players/${player.player_id}`}
                  className="text-[13px] font-semibold text-nfl-navy hover:underline"
                >
                  {player.first_name} {player.last_name}
                </Link>
              </td>

              {/* Stat values */}
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="whitespace-nowrap px-3 py-2 font-mono text-[13px] font-medium leading-none tracking-tight text-foreground/85"
                >
                  {col.format(player[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
