"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import type { PlayerStats } from "@/lib/types/player-stats";
import type { ColumnDef } from "@/lib/columns";
import { cn } from "@/lib/utils/cn";
import { parseRecord } from "@/lib/utils/format";
import { StatTooltip } from "@/components/StatTooltip";
import { getStatDescription } from "@/lib/stat-definitions";

const PAGE_SIZE = 50;

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const neighbors = new Set<number>();
  neighbors.add(1);
  neighbors.add(total);
  for (let i = current - 1; i <= current + 1; i++) {
    if (i >= 1 && i <= total) neighbors.add(i);
  }

  const sorted = [...neighbors].sort((a, b) => a - b);
  const pages: (number | "...")[] = [];

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      pages.push("...");
    }
    pages.push(sorted[i]);
  }

  return pages;
}

interface SortableStatsTableProps {
  players: PlayerStats[];
  columns: ColumnDef[];
  defaultSortKey?: keyof PlayerStats;
}

export function SortableStatsTable({ players, columns, defaultSortKey }: SortableStatsTableProps) {
  const [sortKey, setSortKey] = useState<keyof PlayerStats | null>(defaultSortKey ?? null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [players]);

  function handleSort(key: keyof PlayerStats) {
    if (sortKey === key) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    setCurrentPage(1);
  }

  const sorted = useMemo(() => {
    if (!sortKey) return players;
    return [...players].sort((a, b) => {
      const aRaw = a[sortKey];
      const bRaw = b[sortKey];
      const aStr = String(aRaw ?? "");
      const bStr = String(bRaw ?? "");
      const aNum = Number(aRaw);
      const bNum = Number(bRaw);

      // Numeric sort (handles pg decimal strings like "0.123")
      if (!isNaN(aNum) || !isNaN(bNum)) {
        return sortDir === "asc"
          ? (aNum || 0) - (bNum || 0)
          : (bNum || 0) - (aNum || 0);
      }

      // Record sort (e.g., "12-5", "9-8")
      const aRec = parseRecord(aStr);
      const bRec = parseRecord(bStr);
      if (!isNaN(aRec) && !isNaN(bRec)) {
        return sortDir === "asc" ? aRec - bRec : bRec - aRec;
      }

      // Fallback string sort
      return sortDir === "asc"
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });
  }, [players, sortKey, sortDir]);

  const totalPlayers = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalPlayers / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, totalPlayers);
  const pageRows = sorted.slice(startIndex, endIndex);

  return (
    <div className="overflow-x-auto rounded-md border border-foreground/[0.06]">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-foreground/[0.025]">
            {/* Rank column */}
            <th className="sticky left-0 z-20 whitespace-nowrap border-b border-r border-foreground/[0.06] bg-[#f8f8f8] px-2 py-1.5 text-center text-[9px] font-semibold uppercase tracking-[0.06em] text-foreground/35">
              #
            </th>

            {/* Player name column */}
            <th className="sticky left-[29px] z-20 whitespace-nowrap border-b border-r border-foreground/[0.06] bg-[#f8f8f8] px-3 py-1.5 text-left text-[9px] font-semibold uppercase tracking-[0.06em] text-foreground/35">
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
                  <StatTooltip content={getStatDescription(col.key)}>
                    {col.label}
                  </StatTooltip>
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
          {pageRows.map((player, i) => (
            <tr
              key={player.player_id}
              className="transition-colors even:bg-foreground/[0.015] hover:bg-foreground/[0.04]"
            >
              {/* Rank */}
              <td className="sticky left-0 z-10 whitespace-nowrap border-r border-foreground/[0.06] bg-white px-2 py-2 text-center font-mono text-[12px] text-foreground/30">
                {startIndex + i + 1}
              </td>

              {/* Player name */}
              <td className="sticky left-[29px] z-10 whitespace-nowrap border-r border-foreground/[0.06] bg-white px-3 py-2">
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

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-foreground/[0.06] px-3 py-2">
          <span className="text-[12px] text-foreground/50">
            Showing {startIndex + 1}&ndash;{endIndex} of {totalPlayers} players
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className={cn(
                "cursor-pointer rounded px-2 py-1 text-[12px] font-medium transition-colors",
                safePage <= 1
                  ? "cursor-not-allowed text-foreground/20"
                  : "text-foreground/50 hover:bg-foreground/[0.05] hover:text-foreground/70"
              )}
            >
              Prev
            </button>

            {getPageNumbers(safePage, totalPages).map((page, idx) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-1 text-[12px] text-foreground/30"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page as number)}
                  className={cn(
                    "min-w-[28px] cursor-pointer rounded px-1.5 py-1 text-[12px] font-medium transition-colors",
                    safePage === page
                      ? "bg-nfl-navy text-white"
                      : "text-foreground/50 hover:bg-foreground/[0.05] hover:text-foreground/70"
                  )}
                >
                  {page}
                </button>
              )
            )}

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className={cn(
                "cursor-pointer rounded px-2 py-1 text-[12px] font-medium transition-colors",
                safePage >= totalPages
                  ? "cursor-not-allowed text-foreground/20"
                  : "text-foreground/50 hover:bg-foreground/[0.05] hover:text-foreground/70"
              )}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
