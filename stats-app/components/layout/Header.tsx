'use client';

import Link from 'next/link';
import { DateRangeFilter } from '@/components/filters';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight hover:opacity-80 transition-opacity"
          >
            NFL Stats
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link
              href="/compare"
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              Compare
            </Link>
            <Link
              href="/chart"
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              Charts
            </Link>
            <Link
              href="/dictionary"
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              Dictionary
            </Link>
          </nav>
        </div>

        <div className="pb-4">
          <DateRangeFilter />
        </div>
      </div>
    </header>
  );
}
