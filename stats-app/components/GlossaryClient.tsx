"use client";

import { useState } from "react";
import {
  GLOSSARY_CATEGORIES,
  STAT_DEFINITIONS,
  getStatDefinition,
  getStatDisplayLabel,
} from "@/lib/stat-definitions";
import { TEAM_COMPARE_CATEGORIES } from "@/lib/compare-categories";
import { cn } from "@/lib/utils/cn";

type GlossaryMode = "player" | "team";

const TEAM_ONLY_TITLES = ["Team Overview", "Team Efficiency", "Situational"];

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[&()]/g, "");
}

export function GlossaryClient() {
  const [mode, setMode] = useState<GlossaryMode>("player");

  const playerCategories = GLOSSARY_CATEGORIES.filter(
    (c) => !TEAM_ONLY_TITLES.includes(c.title)
  );

  const categories =
    mode === "player"
      ? playerCategories.map((c) => ({
          title: c.title,
          description: c.description,
          stats: c.stats,
        }))
      : TEAM_COMPARE_CATEGORIES.map((c) => ({
          title: c.title,
          description: "",
          stats: c.stats,
        }));

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stat Glossary</h1>
          <p className="mt-2 text-foreground/60">
            Definitions for every stat and metric used across the app.
          </p>
        </div>
        <div className="flex rounded-lg border border-foreground/10 p-0.5">
          {(["player", "team"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
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

      {/* Jump links */}
      <nav className="mt-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <a
            key={cat.title}
            href={`#${slugify(cat.title)}`}
            className="rounded-md border border-foreground/[0.06] px-2.5 py-1 text-[12px] font-medium text-foreground/50 transition-colors hover:border-nfl-navy/30 hover:text-nfl-navy"
          >
            {cat.title}
          </a>
        ))}
      </nav>

      {/* Category sections */}
      <div className="mt-8 space-y-10">
        {categories.map((cat) => (
          <section key={cat.title} id={slugify(cat.title)}>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-nfl-navy">
              {cat.title}
            </h2>
            {cat.description && (
              <p className="mt-1 text-[13px] text-foreground/50">
                {cat.description}
              </p>
            )}

            <div className="mt-3 overflow-x-auto rounded-md border border-foreground/[0.06]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-foreground/[0.025]">
                    <th className="whitespace-nowrap border-b border-foreground/[0.06] px-3 py-1.5 text-left text-[9px] font-semibold uppercase tracking-[0.06em] text-foreground/35">
                      Stat
                    </th>
                    <th className="whitespace-nowrap border-b border-foreground/[0.06] px-3 py-1.5 text-left text-[9px] font-semibold uppercase tracking-[0.06em] text-foreground/35">
                      Abbr
                    </th>
                    <th className="border-b border-foreground/[0.06] px-3 py-1.5 text-left text-[9px] font-semibold uppercase tracking-[0.06em] text-foreground/35">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cat.stats.map((key) => {
                    const def =
                      mode === "player"
                        ? STAT_DEFINITIONS[key]
                        : getStatDefinition(key);
                    if (!def) return null;

                    const label =
                      mode === "team"
                        ? getStatDisplayLabel(key)
                        : def.label;

                    return (
                      <tr
                        key={key}
                        className="transition-colors even:bg-foreground/[0.015] hover:bg-foreground/[0.04]"
                      >
                        <td className="whitespace-nowrap px-3 py-2 text-[13px] font-semibold text-foreground/85">
                          {label}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 font-mono text-[13px] font-medium text-nfl-navy">
                          {def.abbr}
                        </td>
                        <td className="px-3 py-2 text-[13px] leading-relaxed text-foreground/70">
                          {def.description}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
