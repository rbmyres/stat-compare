"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { SearchResult } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

export function SearchBar({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value);
    setActiveIndex(-1);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.length < 2) {
      setResults([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
        const data = await res.json();
        setResults(data.results || []);
        setIsOpen(true);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  }

  function navigateToResult(result: SearchResult) {
    const path =
      result.type === "player"
        ? `/players/${result.id}`
        : `/teams/${result.id}`;
    router.push(path);
    setQuery("");
    setResults([]);
    setIsOpen(false);
    onNavigate?.();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % results.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0) {
          navigateToResult(results[activeIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  }

  const teamResults = results.filter((r) => r.type === "team");
  const playerResults = results.filter((r) => r.type === "player");
  let flatIndex = -1;

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder="Search players & teams..."
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="search-listbox"
          aria-haspopup="listbox"
          aria-activedescendant={
            activeIndex >= 0 ? `search-result-${activeIndex}` : undefined
          }
          className={cn(
            "peer w-full rounded-lg border border-white/20 bg-white/10 py-2 pl-10 pr-10 text-sm text-white placeholder:text-white/40",
            "transition-all duration-200",
            "focus:bg-white focus:text-foreground focus:placeholder:text-foreground/40 focus:border-white focus:outline-none"
          )}
        />
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40 transition-colors duration-200 peer-focus:text-foreground/40"
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
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          </div>
        )}
      </div>

      {isOpen && (
        <div
          id="search-listbox"
          role="listbox"
          className="absolute top-full left-0 right-0 z-50 mt-2 max-h-80 overflow-y-auto rounded-lg border border-foreground/10 bg-white shadow-lg"
        >
          {results.length === 0 && !isLoading ? (
            <div className="px-4 py-3 text-sm text-foreground/50">
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <>
              {teamResults.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-foreground/40">
                    Teams
                  </div>
                  {teamResults.map((result) => {
                    flatIndex++;
                    const idx = flatIndex;
                    return (
                      <button
                        key={`team-${result.id}`}
                        id={`search-result-${idx}`}
                        role="option"
                        aria-selected={activeIndex === idx}
                        onClick={() => navigateToResult(result)}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={cn(
                          "flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors",
                          activeIndex === idx
                            ? "bg-nfl-navy/5"
                            : "hover:bg-foreground/5"
                        )}
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-nfl-navy/10 text-xs font-bold text-nfl-navy">
                          {result.id}
                        </span>
                        <div>
                          <div className="font-medium text-foreground">
                            {result.name}
                          </div>
                          <div className="text-xs text-foreground/50">
                            {result.subtitle}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
              {playerResults.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-foreground/40">
                    Players
                  </div>
                  {playerResults.map((result) => {
                    flatIndex++;
                    const idx = flatIndex;
                    return (
                      <button
                        key={`player-${result.id}`}
                        id={`search-result-${idx}`}
                        role="option"
                        aria-selected={activeIndex === idx}
                        onClick={() => navigateToResult(result)}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={cn(
                          "flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors",
                          activeIndex === idx
                            ? "bg-nfl-navy/5"
                            : "hover:bg-foreground/5"
                        )}
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/10 text-xs font-medium text-foreground/60">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </span>
                        <div>
                          <div className="font-medium text-foreground">
                            {result.name}
                          </div>
                          <div className="text-xs text-foreground/50">
                            Season {result.subtitle}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
