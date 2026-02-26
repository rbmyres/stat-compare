"use client";

import { useState, useMemo } from "react";
import type { CompareMode } from "@/lib/filters/compare-params";
import { getCompareCategories } from "@/lib/compare-categories";
import { getStatDefinition, getStatDisplayLabel } from "@/lib/stat-definitions";
import { cn } from "@/lib/utils/cn";

interface StatPickerProps {
  mode: CompareMode;
  selected: string[];
  onToggle: (key: string) => void;
  onBulkAdd: (keys: string[]) => void;
  onBulkRemove?: (keys: string[]) => void;
  onClear: () => void;
}

export function StatPicker({
  mode,
  selected,
  onToggle,
  onBulkAdd,
  onBulkRemove,
  onClear,
}: StatPickerProps) {
  const categories = getCompareCategories(mode);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const searchResults = useMemo(() => {
    if (!search.trim()) return null;
    const term = search.toLowerCase();
    const matches: string[] = [];
    for (const cat of categories) {
      for (const key of cat.stats) {
        if (getStatDisplayLabel(key).toLowerCase().includes(term)) {
          matches.push(key);
        }
      }
    }
    return matches;
  }, [search, categories]);

  return (
    <div className="space-y-3">
      {/* Selected stats as chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-medium text-foreground/40 mr-1">
            {selected.length} stat{selected.length !== 1 && "s"}
          </span>
          {selected.map((key) => {
            const def = getStatDefinition(key);
            const suffix = key.startsWith("off_")
              ? " (Off)"
              : key.startsWith("def_")
                ? " (Def)"
                : "";
            return (
              <button
                type="button"
                key={key}
                onClick={() => onToggle(key)}
                aria-label={`Remove ${(def?.abbr ?? key) + suffix}`}
                className="inline-flex items-center gap-1 rounded-full bg-nfl-navy/8 px-2.5 py-1 text-xs font-medium text-nfl-navy hover:bg-nfl-navy/15 transition-colors"
              >
                {(def?.abbr ?? key) + suffix}
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            );
          })}
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-foreground/40 hover:text-foreground/70 transition-colors ml-1"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Search input */}
      <div className="relative max-w-sm">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search stats..."
          aria-label="Search stats"
          className="w-full rounded-lg border border-foreground/15 bg-background py-2 pl-9 pr-3 text-sm placeholder:text-foreground/35 focus:border-nfl-navy/30 focus:outline-none focus:ring-1 focus:ring-nfl-navy/20"
        />
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/30"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Search results (flat list) */}
      {searchResults !== null ? (
        <div className="rounded-lg border border-foreground/10 p-3">
          {searchResults.length === 0 ? (
            <p className="text-xs text-foreground/40">
              No stats matching &ldquo;{search}&rdquo;
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1">
              {searchResults.map((key) => {
                const isSelected = selected.includes(key);
                return (
                  <label
                    key={key}
                    className="flex items-center gap-2 cursor-pointer py-0.5 group"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggle(key)}
                      className="h-3.5 w-3.5 rounded border-foreground/20 text-nfl-navy focus:ring-nfl-navy/30"
                    />
                    <span
                      className={cn(
                        "text-xs transition-colors",
                        isSelected
                          ? "text-foreground font-medium"
                          : "text-foreground/60 group-hover:text-foreground/80"
                      )}
                    >
                      {getStatDisplayLabel(key)}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Category accordion */
        <div className="rounded-lg border border-foreground/10 divide-y divide-foreground/[0.06]">
          {categories.map((category) => {
            const isExpanded = expandedCategory === category.title;
            const selectedInCategory = category.stats.filter((s) =>
              selected.includes(s)
            ).length;

            return (
              <div key={category.title}>
                <button
                  type="button"
                  onClick={() =>
                    setExpandedCategory(isExpanded ? null : category.title)
                  }
                  aria-expanded={isExpanded}
                  className="flex w-full items-center justify-between px-3 py-2.5 text-left hover:bg-foreground/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{category.title}</span>
                    {selectedInCategory > 0 && (
                      <span className="rounded-full bg-nfl-navy/10 px-1.5 py-0.5 text-[10px] font-semibold text-nfl-navy">
                        {selectedInCategory}
                      </span>
                    )}
                  </div>
                  <svg
                    className={cn(
                      "h-4 w-4 text-foreground/30 transition-transform",
                      isExpanded && "rotate-180"
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isExpanded && (
                  <div className="border-t border-foreground/[0.04] bg-foreground/[0.01] px-3 py-2">
                    <div className="mb-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const toAdd = category.stats.filter(
                            (s) => !selected.includes(s)
                          );
                          if (toAdd.length > 0) onBulkAdd(toAdd);
                        }}
                        className="text-[11px] text-nfl-navy/70 hover:text-nfl-navy transition-colors"
                      >
                        Select all
                      </button>
                      <span className="text-foreground/20">|</span>
                      <button
                        type="button"
                        onClick={() => {
                          const toRemove = category.stats.filter((s) => selected.includes(s));
                          if (toRemove.length > 0) {
                            if (onBulkRemove) {
                              onBulkRemove(toRemove);
                            } else {
                              toRemove.forEach((s) => onToggle(s));
                            }
                          }
                        }}
                        className="text-[11px] text-foreground/40 hover:text-foreground/70 transition-colors"
                      >
                        Deselect all
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1">
                      {category.stats.map((key) => {
                        const isSelected = selected.includes(key);
                        return (
                          <label
                            key={key}
                            className="flex items-center gap-2 cursor-pointer py-0.5 group"
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => onToggle(key)}
                              className="h-3.5 w-3.5 rounded border-foreground/20 text-nfl-navy focus:ring-nfl-navy/30"
                            />
                            <span
                              className={cn(
                                "text-xs transition-colors",
                                isSelected
                                  ? "text-foreground font-medium"
                                  : "text-foreground/60 group-hover:text-foreground/80"
                              )}
                            >
                              {getStatDisplayLabel(key)}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
