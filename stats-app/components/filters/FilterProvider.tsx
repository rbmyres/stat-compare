'use client';

import {
  createContext,
  useContext,
  type ReactNode,
} from 'react';
import {
  useQueryState,
  parseAsInteger,
  parseAsStringLiteral,
} from 'nuqs';
import type { SeasonType } from './SeasonTypeToggle';

interface FilterContextType {
  // Season range
  seasonStart: number | null;
  seasonEnd: number | null;
  setSeasonStart: (value: number | null) => void;
  setSeasonEnd: (value: number | null) => void;

  // Week range
  weekStart: number | null;
  weekEnd: number | null;
  setWeekStart: (value: number | null) => void;
  setWeekEnd: (value: number | null) => void;

  // Season type
  seasonType: SeasonType | null;
  setSeasonType: (value: SeasonType | null) => void;

  // Helper to get all params for API calls
  getQueryParams: () => URLSearchParams;

  // Reset all filters
  resetFilters: () => void;
}

const FilterContext = createContext<FilterContextType | null>(null);

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}

const seasonTypeOptions = ['REG', 'POST', 'REG,POST'] as const;

interface FilterProviderProps {
  children: ReactNode;
}

export function FilterProvider({ children }: FilterProviderProps) {
  // Season range with URL state
  const [seasonStart, setSeasonStart] = useQueryState(
    'seasonStart',
    parseAsInteger
  );
  const [seasonEnd, setSeasonEnd] = useQueryState(
    'seasonEnd',
    parseAsInteger
  );

  // Week range with URL state
  const [weekStart, setWeekStart] = useQueryState(
    'weekStart',
    parseAsInteger
  );
  const [weekEnd, setWeekEnd] = useQueryState(
    'weekEnd',
    parseAsInteger
  );

  // Season type with URL state
  const [seasonType, setSeasonType] = useQueryState(
    'seasonType',
    parseAsStringLiteral(seasonTypeOptions)
  );

  // Build query params for API calls
  const getQueryParams = () => {
    const params = new URLSearchParams();
    if (seasonStart !== null) params.set('seasonStart', String(seasonStart));
    if (seasonEnd !== null) params.set('seasonEnd', String(seasonEnd));
    if (weekStart !== null) params.set('weekStart', String(weekStart));
    if (weekEnd !== null) params.set('weekEnd', String(weekEnd));
    if (seasonType !== null) params.set('seasonType', seasonType);
    return params;
  };

  // Reset all filters
  const resetFilters = () => {
    setSeasonStart(null);
    setSeasonEnd(null);
    setWeekStart(null);
    setWeekEnd(null);
    setSeasonType(null);
  };

  return (
    <FilterContext.Provider
      value={{
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
        getQueryParams,
        resetFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}
