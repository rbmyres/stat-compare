'use client';

import { cn } from '@/lib/utils/cn';

export type SeasonType = 'REG' | 'POST' | 'REG,POST';

interface SeasonTypeToggleProps {
  value: SeasonType | null;
  onChange: (value: SeasonType | null) => void;
  className?: string;
}

const options: { value: SeasonType; label: string }[] = [
  { value: 'REG', label: 'Regular' },
  { value: 'POST', label: 'Playoffs' },
  { value: 'REG,POST', label: 'Both' },
];

export function SeasonTypeToggle({
  value,
  onChange,
  className,
}: SeasonTypeToggleProps) {
  // Default to 'Both' when null
  const effectiveValue = value ?? 'REG,POST';

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <label className="text-sm font-medium text-foreground/70">Type</label>
      <div
        role="radiogroup"
        aria-label="Season type"
        className="inline-flex rounded-md border border-foreground/20 p-0.5"
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={effectiveValue === option.value}
            onClick={() => onChange(option.value === 'REG,POST' ? null : option.value)}
            className={cn(
              'px-3 py-1.5 text-sm font-medium rounded transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:ring-offset-1',
              effectiveValue === option.value
                ? 'bg-foreground text-background'
                : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
