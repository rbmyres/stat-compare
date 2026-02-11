'use client';

import { useFilters } from '@/components/filters';

export default function Home() {
  const {
    seasonStart,
    seasonEnd,
    weekStart,
    weekEnd,
    seasonType,
    getQueryParams,
  } = useFilters();

  const queryString = getQueryParams().toString();

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold tracking-tight">NFL Statistics</h1>
        <p className="mt-2 text-foreground/70">
          Compare player and team statistics from 1999 to present.
        </p>
      </section>

      <section className="rounded-lg border border-foreground/10 p-6">
        <h2 className="text-lg font-semibold mb-4">Active Filters</h2>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-foreground/50">Season Range</dt>
            <dd className="font-mono">
              {seasonStart ?? 'All'} – {seasonEnd ?? 'All'}
            </dd>
          </div>
          <div>
            <dt className="text-foreground/50">Week Range</dt>
            <dd className="font-mono">
              {weekStart ?? '1'} – {weekEnd ?? '22'}
            </dd>
          </div>
          <div>
            <dt className="text-foreground/50">Season Type</dt>
            <dd className="font-mono">{seasonType ?? 'All (REG + POST)'}</dd>
          </div>
          <div>
            <dt className="text-foreground/50">Query String</dt>
            <dd className="font-mono text-xs break-all">
              {queryString || '(no filters)'}
            </dd>
          </div>
        </dl>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <a
          href="/compare"
          className="group rounded-lg border border-foreground/10 p-6 hover:border-foreground/30 transition-colors"
        >
          <h3 className="font-semibold group-hover:underline">Compare</h3>
          <p className="mt-1 text-sm text-foreground/70">
            Side-by-side player and team comparisons
          </p>
        </a>
        <a
          href="/chart"
          className="group rounded-lg border border-foreground/10 p-6 hover:border-foreground/30 transition-colors"
        >
          <h3 className="font-semibold group-hover:underline">Charts</h3>
          <p className="mt-1 text-sm text-foreground/70">
            Interactive scatter plots and visualizations
          </p>
        </a>
        <a
          href="/dictionary"
          className="group rounded-lg border border-foreground/10 p-6 hover:border-foreground/30 transition-colors"
        >
          <h3 className="font-semibold group-hover:underline">Dictionary</h3>
          <p className="mt-1 text-sm text-foreground/70">
            Stat definitions and calculation formulas
          </p>
        </a>
      </section>
    </div>
  );
}
