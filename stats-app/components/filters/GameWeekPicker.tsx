'use client';

import { cn } from '@/lib/utils/cn';

interface GameWeekPickerProps {
  label: string;
  season: number | null;
  week: number | null;
  onSeasonChange: (value: number | null) => void;
  onWeekChange: (value: number | null) => void;
  minSeason?: number;
  maxSeason?: number;
  className?: string;
}

export function GameWeekPicker({
  label,
  season,
  week,
  onSeasonChange,
  onWeekChange,
  minSeason = 1999,
  maxSeason = 2024,
  className,
}: GameWeekPickerProps) {
  // Generate year options from max to min (newest first)
  const years = Array.from(
    { length: maxSeason - minSeason + 1 },
    (_, i) => maxSeason - i
  );

  // Weeks 1-22 (regular season 1-18, playoffs 19-22)
  const weeks = Array.from({ length: 22 }, (_, i) => i + 1);

  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onSeasonChange(value === '' ? null : parseInt(value, 10));
  };

  const handleWeekChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onWeekChange(value === '' ? null : parseInt(value, 10));
  };

  const getWeekLabel = (w: number) => {
    if (w <= 18) return `Week ${w}`;
    return `Playoff ${w - 18}`;
  };

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label className="text-sm font-medium text-foreground/70">{label}</label>
      <div className="flex items-center gap-2">
        <select
          value={season ?? ''}
          onChange={handleSeasonChange}
          className={cn(
            'h-9 rounded-md border border-foreground/20 bg-background px-3 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-foreground/20',
            'hover:border-foreground/30 transition-colors'
          )}
          aria-label={`${label} season`}
        >
          <option value="">Year</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <select
          value={week ?? ''}
          onChange={handleWeekChange}
          className={cn(
            'h-9 rounded-md border border-foreground/20 bg-background px-3 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-foreground/20',
            'hover:border-foreground/30 transition-colors',
            !season && 'opacity-50'
          )}
          aria-label={`${label} week`}
          disabled={!season}
        >
          <option value="">Week</option>
          {weeks.map((w) => (
            <option key={w} value={w}>
              {getWeekLabel(w)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
