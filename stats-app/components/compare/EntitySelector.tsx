"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import type { SearchResult } from "@/lib/types";
import type { CompareMode } from "@/lib/filters/compare-params";
import { cn } from "@/lib/utils/cn";

export interface CompareEntity {
  id: string;
  name: string;
  subtitle: string;
  image_url?: string;
}

interface EntitySelectorProps {
  mode: CompareMode;
  entities: CompareEntity[];
  onAdd: (entity: CompareEntity) => void;
  onRemove: (id: string) => void;
}

export function EntitySelector({
  mode,
  entities,
  onAdd,
  onRemove,
}: EntitySelectorProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const canAdd = entities.length < 4;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value);
    setActiveIndex(-1);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    abortRef.current?.abort();

    if (value.length < 2) {
      setResults([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debounceRef.current = setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(value)}&type=${mode}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error(`Search failed: ${res.status}`);
        const data = await res.json();
        const filtered = (data.results || []).filter(
          (r: SearchResult) =>
            r.type === mode && !entities.some((e) => e.id === r.id)
        );
        setResults(filtered);
        setIsOpen(true);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setResults([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 300);
  }

  function selectResult(result: SearchResult) {
    onAdd({
      id: result.id,
      name: result.name,
      subtitle: result.subtitle,
      image_url: result.image_url,
    });
    setQuery("");
    setResults([]);
    setIsOpen(false);
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
        setActiveIndex(
          (prev) => (prev - 1 + results.length) % results.length
        );
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0) selectResult(results[activeIndex]);
        break;
      case "Escape":
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  }

  return (
    <div className="space-y-3">
      {/* Selected entity cards */}
      {entities.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {entities.map((entity) => (
            <div
              key={entity.id}
              className="flex items-center gap-2 rounded-lg border border-foreground/10 bg-foreground/2 px-3 py-2"
            >
              {entity.image_url ? (
                <Image
                  src={entity.image_url}
                  alt={entity.name}
                  width={32}
                  height={32}
                  className={cn(
                    "h-8 w-8 object-contain",
                    mode === "player" && "rounded-full bg-foreground/5"
                  )}
                />
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/10 text-xs font-medium text-foreground/60">
                  {entity.name.charAt(0)}
                </span>
              )}
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{entity.name}</div>
                <div className="text-xs text-foreground/50">{entity.subtitle}</div>
              </div>
              <button
                onClick={() => onRemove(entity.id)}
                className="ml-1 rounded p-0.5 text-foreground/30 hover:bg-foreground/5 hover:text-foreground/70 transition-colors"
                aria-label={`Remove ${entity.name}`}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search input */}
      {canAdd && (
        <div ref={wrapperRef} className="relative max-w-sm">
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
              placeholder={
                entities.length === 0
                  ? `Search ${mode === "player" ? "players" : "teams"} to compare...`
                  : `Add another ${mode === "player" ? "player" : "team"}...`
              }
              role="combobox"
              aria-expanded={isOpen}
              aria-controls="entity-selector-listbox"
              className="w-full rounded-lg border border-foreground/15 bg-white py-2 pl-9 pr-3 text-sm placeholder:text-foreground/35 focus:border-nfl-navy/30 focus:outline-none focus:ring-1 focus:ring-nfl-navy/20"
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
            {isLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground/60" />
              </div>
            )}
          </div>

          {isOpen && (
            <div
              id="entity-selector-listbox"
              role="listbox"
              className="absolute top-full left-0 right-0 z-50 mt-1 max-h-64 overflow-y-auto rounded-lg border border-foreground/10 bg-white shadow-lg"
            >
              {results.length === 0 && !isLoading ? (
                <div className="px-4 py-3 text-sm text-foreground/50">
                  No results for &ldquo;{query}&rdquo;
                </div>
              ) : (
                results.map((result, i) => (
                  <button
                    key={result.id}
                    role="option"
                    aria-selected={activeIndex === i}
                    onClick={() => selectResult(result)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={cn(
                      "flex w-full cursor-pointer items-center gap-3 px-3 py-2 text-left text-sm transition-colors",
                      activeIndex === i
                        ? "bg-nfl-navy/5"
                        : "hover:bg-foreground/5"
                    )}
                  >
                    {result.image_url ? (
                      <Image
                        src={result.image_url}
                        alt={result.name}
                        width={32}
                        height={32}
                        className={cn(
                          "h-8 w-8 object-contain",
                          result.type === "player" &&
                            "rounded-full bg-foreground/5"
                        )}
                      />
                    ) : (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/10 text-xs font-medium text-foreground/60">
                        {result.name.charAt(0)}
                      </span>
                    )}
                    <div>
                      <div className="font-medium text-foreground">
                        {result.name}
                      </div>
                      <div className="text-xs text-foreground/50">
                        {result.subtitle}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
