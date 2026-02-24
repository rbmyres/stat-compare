"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { TeamStats } from "@/lib/types/team-stats";
import type { TeamColumnDef } from "@/lib/team-columns";
import { cn } from "@/lib/utils/cn";
import { StatTooltip } from "@/components/StatTooltip";
import { getStatDescription } from "@/lib/stat-definitions";

interface SortableTeamTableProps {
  teams: TeamStats[];
  columns: TeamColumnDef[];
}

export function SortableTeamTable({ teams, columns }: SortableTeamTableProps) {
  const [sortKey, setSortKey] = useState<keyof TeamStats | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  function handleSort(key: keyof TeamStats) {
    if (sortKey === key) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const sorted = useMemo(() => {
    if (!sortKey) return teams;
    return [...teams].sort((a, b) => {
      const aRaw = a[sortKey];
      const bRaw = b[sortKey];
      const aNum = Number(aRaw);
      const bNum = Number(bRaw);

      // Numeric sort (handles pg decimal strings like "0.123")
      if (!isNaN(aNum) || !isNaN(bNum)) {
        return sortDir === "asc"
          ? (aNum || 0) - (bNum || 0)
          : (bNum || 0) - (aNum || 0);
      }

      // Truly non-numeric strings (e.g., record "12-5")
      return sortDir === "asc"
        ? String(aRaw ?? "").localeCompare(String(bRaw ?? ""))
        : String(bRaw ?? "").localeCompare(String(aRaw ?? ""));
    });
  }, [teams, sortKey, sortDir]);

  return (
    <div className="overflow-x-auto rounded-md border border-foreground/[0.06]">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-foreground/[0.025]">
            <th className="sticky left-0 z-20 whitespace-nowrap border-b border-r border-foreground/[0.06] bg-[#f8f8f8] px-2 py-1.5 text-center text-[9px] font-semibold uppercase tracking-[0.06em] text-foreground/35">
              #
            </th>
            <th className="sticky left-[29px] z-20 whitespace-nowrap border-b border-r border-foreground/[0.06] bg-[#f8f8f8] px-3 py-1.5 text-left text-[9px] font-semibold uppercase tracking-[0.06em] text-foreground/35">
              Team
            </th>
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
          {sorted.map((team, i) => (
            <tr
              key={team.team_id}
              className="transition-colors even:bg-foreground/[0.015] hover:bg-foreground/[0.04]"
            >
              <td className="sticky left-0 z-10 whitespace-nowrap border-r border-foreground/[0.06] bg-white px-2 py-2 text-center font-mono text-[12px] text-foreground/30">
                {i + 1}
              </td>
              <td className="sticky left-[29px] z-10 whitespace-nowrap border-r border-foreground/[0.06] bg-white px-3 py-2">
                <Link
                  href={`/teams/${team.team_id}`}
                  className="text-[13px] font-semibold text-nfl-navy hover:underline"
                >
                  {team.team_name}
                </Link>
              </td>
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="whitespace-nowrap px-3 py-2 font-mono text-[13px] font-medium leading-none tracking-tight text-foreground/85"
                >
                  {col.format(team[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
