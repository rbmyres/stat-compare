import { z } from 'zod';

// Date range query parameters validation
export const dateRangeSchema = z.object({
  seasonStart: z.coerce.number().int().min(1999).max(2030).optional(),
  seasonEnd: z.coerce.number().int().min(1999).max(2030).optional(),
  weekStart: z.coerce.number().int().min(1).max(22).optional(),
  weekEnd: z.coerce.number().int().min(1).max(22).optional(),
  seasonType: z.enum(['REG', 'POST', 'REG,POST']).optional(),
});

// Search query validation
export const searchSchema = z.object({
  q: z.string().min(1).max(100).optional(),
  limit: z.coerce.number().int().min(1).max(500).default(100),
});

// Player ID validation
export const playerIdSchema = z.string().min(1).max(32);

// Team ID validation (3-letter abbreviation)
export const teamIdSchema = z.string().length(3).toUpperCase();

// Helper to parse URL search params into an object
export function parseSearchParams(
  searchParams: URLSearchParams
): Record<string, string> {
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

// Helper to validate date range params from URL
export function validateDateRange(params: Record<string, string>) {
  return dateRangeSchema.safeParse(params);
}
