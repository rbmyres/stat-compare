"use client";

import type { CompareMode } from "@/lib/filters/compare-params";
import type { CompareEntity } from "./EntitySelector";
import { formatStatValue } from "@/lib/compare-format-map";
import { getStatDefinition, getStatDisplayLabel } from "@/lib/stat-definitions";
import { LOWER_IS_BETTER } from "@/lib/compare-categories";
import { StatTooltip } from "@/components/StatTooltip";
import { cn } from "@/lib/utils/cn";
import { num } from "@/lib/utils/format";

interface ComparisonTableProps {
  entities: CompareEntity[];
  entityStats: Record<string, Record<string, unknown>>;
  stats: string[];
  mode: CompareMode;
}

function getBestIndex(
  values: unknown[],
  key: string
): number | null {
  const lowerBetter = LOWER_IS_BETTER.has(key);
  let bestIdx: number | null = null;
  let bestVal = lowerBetter ? Infinity : -Infinity;

  for (let i = 0; i < values.length; i++) {
    const n = num(values[i]);
    if (isNaN(Number(values[i])) || values[i] === null || values[i] === undefined) continue;
    if (lowerBetter ? n < bestVal : n > bestVal) {
      bestVal = n;
      bestIdx = i;
    }
  }

  // Don't highlight if all values are equal
  const numericValues = values.filter(
    (v) => !isNaN(Number(v)) && v !== null && v !== undefined
  );
  if (numericValues.length < 2) return null;
  const allEqual = numericValues.every((v) => num(v) === num(numericValues[0]));
  if (allEqual) return null;

  return bestIdx;
}

export function ComparisonTable({
  entities,
  entityStats,
  stats,
  mode,
}: ComparisonTableProps) {
  if (entities.length < 2 || stats.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-lg border border-foreground/10">
      <table className="w-full text-sm">
        {/* Header: entity images + names */}
        <thead>
          <tr className="border-b border-foreground/[0.06]">
            <th className="px-4 py-3 text-left font-medium text-foreground/40 w-[180px] min-w-[140px]">
              Stat
            </th>
            {entities.map((entity) => (
              <th
                key={entity.id}
                className="px-4 py-3 text-center min-w-[120px]"
              >
                <div className="flex flex-col items-center gap-1.5">
                  {entity.image_url ? (
                    <img
                      src={entity.image_url}
                      alt=""
                      className={cn(
                        "h-12 w-12 object-contain",
                        mode === "player" && "rounded-full bg-foreground/5"
                      )}
                    />
                  ) : (
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground/10 text-lg font-bold text-foreground/40">
                      {entity.name.charAt(0)}
                    </span>
                  )}
                  <div>
                    <div className="font-semibold text-foreground text-xs">
                      {entity.name}
                    </div>
                    <div className="text-[10px] text-foreground/40 font-normal">
                      {entity.subtitle}
                    </div>
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* Stat rows */}
        <tbody>
          {stats.map((key, i) => {
            const def = getStatDefinition(key);
            const values = entities.map(
              (e) => entityStats[e.id]?.[key]
            );
            const bestIdx = getBestIndex(values, key);

            return (
              <tr
                key={key}
                className={cn(
                  "border-b border-foreground/[0.04]",
                  i % 2 === 0 ? "bg-white" : "bg-foreground/[0.015]"
                )}
              >
                <td className="px-4 py-2 text-foreground/70">
                  <StatTooltip
                    content={def?.description}
                    position="bottom"
                  >
                    <span className="text-xs font-medium cursor-help">
                      {getStatDisplayLabel(key)}
                    </span>
                  </StatTooltip>
                </td>
                {entities.map((entity, eIdx) => {
                  const raw = entityStats[entity.id]?.[key];
                  const formatted = formatStatValue(key, raw, mode);
                  const isBest = bestIdx === eIdx;

                  return (
                    <td
                      key={entity.id}
                      className={cn(
                        "px-4 py-2 text-center font-mono text-xs tabular-nums",
                        isBest
                          ? "font-bold text-nfl-navy"
                          : "text-foreground/80"
                      )}
                    >
                      {formatted}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
