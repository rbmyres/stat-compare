'use client';

import { cn } from '@/lib/utils/cn';
import { useFilters } from './FilterProvider';
import { GameWeekPicker } from './GameWeekPicker';
import { SeasonTypeToggle } from './SeasonTypeToggle';

interface DateRangeFilterProps {
  className?: string;
}

export function DateRangeFilter({ className }: DateRangeFilterProps) {
  const {
    seasonStart,
    seasonEnd,
    setSeasonStart,
    setSeasonEnd,
    weekStart,
    weekEnd,
    setWeekStart,
    setWeekEnd,
    seasonType,
    setSeasonType,
    resetFilters,
  } = useFilters();

  const hasActiveFilters =
    seasonStart !== null ||
    seasonEnd !== null ||
    weekStart !== null ||
    weekEnd !== null ||
    seasonType !== null;

  // Format the current range for display
  const formatRange = () => {
    if (!seasonStart && !seasonEnd) return null;

    const start = seasonStart
      ? `${weekStart ? `Week ${weekStart}, ` : ''}${seasonStart}`
      : 'Beginning';
    const end = seasonEnd
      ? `${weekEnd ? `Week ${weekEnd}, ` : ''}${seasonEnd}`
      : 'Present';

    return `${start} → ${end}`;
  };

  const rangeText = formatRange();

  return (
    <div
      className={cn(
        'rounded-lg border border-foreground/10 bg-foreground/2 p-4',
        className
      )}
    >
      <div className="flex flex-wrap items-end gap-6">
        <GameWeekPicker
          label="From"
          season={seasonStart}
          week={weekStart}
          onSeasonChange={setSeasonStart}
          onWeekChange={setWeekStart}
        />

        <span className="text-foreground/30 pb-2">→</span>

        <GameWeekPicker
          label="To"
          season={seasonEnd}
          week={weekEnd}
          onSeasonChange={setSeasonEnd}
          onWeekChange={setWeekEnd}
        />

        <SeasonTypeToggle
          value={seasonType}
          onChange={setSeasonType}
        />

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className={cn(
              'text-sm text-foreground/50 hover:text-foreground transition-colors',
              'underline underline-offset-2 pb-2 ml-auto'
            )}
          >
            Clear
          </button>
        )}
      </div>

      {rangeText && (
        <div className="mt-3 pt-3 border-t border-foreground/10 text-sm text-foreground/60">
          Showing: <span className="font-medium text-foreground/80">{rangeText}</span>
          {seasonType && seasonType !== 'REG,POST' && (
            <span className="ml-2">({seasonType === 'REG' ? 'Regular Season' : 'Playoffs'})</span>
          )}
        </div>
      )}
    </div>
  );
}
