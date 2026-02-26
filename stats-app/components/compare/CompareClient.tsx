"use client";

import { useRef, useTransition } from "react";
import { useQueryStates } from "nuqs";
import { compareParsers, type CompareMode } from "@/lib/filters/compare-params";
import { EntitySelector, type CompareEntity } from "./EntitySelector";
import { StatPicker } from "./StatPicker";
import { ComparisonTable } from "./ComparisonTable";
import { ExportToolbar } from "./ExportToolbar";
import { cn } from "@/lib/utils/cn";

interface CompareClientProps {
  initialEntities: CompareEntity[];
  entityStats: Record<string, Record<string, unknown>>;
}

export function CompareClient({
  initialEntities,
  entityStats,
}: CompareClientProps) {
  const [params, setParams] = useQueryStates(compareParsers, {
    shallow: false,
  });
  const [isPending, startTransition] = useTransition();
  const tableRef = useRef<HTMLDivElement>(null);

  const mode = params.mode;
  const selectedStats = params.stats;

  function updateParams(updates: Partial<typeof params>) {
    startTransition(() => {
      setParams(updates);
    });
  }

  function handleModeChange(newMode: CompareMode) {
    updateParams({ mode: newMode, ids: [], stats: [] });
  }

  function handleAddEntity(entity: CompareEntity) {
    if (params.ids.length >= 4 || params.ids.includes(entity.id)) return;
    updateParams({ ids: [...params.ids, entity.id] });
  }

  function handleRemoveEntity(id: string) {
    updateParams({ ids: params.ids.filter((i) => i !== id) });
  }

  function handleToggleStat(key: string) {
    const newStats = params.stats.includes(key)
      ? params.stats.filter((s) => s !== key)
      : [...params.stats, key];
    updateParams({ stats: newStats });
  }

  function handleBulkAdd(keys: string[]) {
    const unique = [...new Set([...params.stats, ...keys])];
    updateParams({ stats: unique });
  }

  function handleBulkRemove(keys: string[]) {
    const removeSet = new Set(keys);
    updateParams({ stats: params.stats.filter((s) => !removeSet.has(s)) });
  }

  function handleClearStats() {
    updateParams({ stats: [] });
  }

  const showTable =
    initialEntities.length >= 2 && selectedStats.length > 0;

  return (
    <div className={cn("space-y-6", isPending && "opacity-70 pointer-events-none transition-opacity")}>
      {/* Header + mode toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Compare</h1>
        <div className="no-print inline-flex self-start rounded-lg border border-foreground/10 p-0.5">
          {(["player", "team"] as const).map((m) => (
            <button
              key={m}
              onClick={() => handleModeChange(m)}
              className={cn(
                "cursor-pointer rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                mode === m
                  ? "bg-nfl-navy text-white"
                  : "text-foreground/60 hover:text-foreground"
              )}
            >
              {m === "player" ? "Players" : "Teams"}
            </button>
          ))}
        </div>
      </div>

      {/* Entity selector */}
      <section className="no-print">
        <EntitySelector
          mode={mode}
          entities={initialEntities}
          onAdd={handleAddEntity}
          onRemove={handleRemoveEntity}
        />
      </section>

      {/* Stat picker */}
      {initialEntities.length > 0 && (
        <section className="no-print">
          <h2 className="mb-2 text-sm font-semibold text-foreground/60 uppercase tracking-wider">
            Stats
          </h2>
          <StatPicker
            mode={mode}
            selected={selectedStats}
            onToggle={handleToggleStat}
            onBulkAdd={handleBulkAdd}
            onBulkRemove={handleBulkRemove}
            onClear={handleClearStats}
          />
        </section>
      )}

      {/* Comparison table + export */}
      {showTable && (
        <section className="space-y-3">
          <ExportToolbar
            tableRef={tableRef}
            entities={initialEntities}
            entityStats={entityStats}
            stats={selectedStats}
            mode={mode}
          />
          <div ref={tableRef}>
            <ComparisonTable
              entities={initialEntities}
              entityStats={entityStats}
              stats={selectedStats}
              mode={mode}
            />
          </div>
        </section>
      )}

      {/* Empty state */}
      {initialEntities.length < 2 && (
        <div className="no-print rounded-lg border border-dashed border-foreground/15 p-8 text-center">
          <p className="text-foreground/40 text-sm">
            {initialEntities.length === 0
              ? `Search and add 2\u20134 ${mode === "player" ? "players" : "teams"} to start comparing.`
              : `Add at least one more ${mode === "player" ? "player" : "team"} to see the comparison.`}
          </p>
        </div>
      )}
    </div>
  );
}
