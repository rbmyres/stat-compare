import { NextRequest, NextResponse } from 'next/server';
import { getPlayer, getPlayerStats } from '@/lib/db/client';
import {
  playerIdSchema,
  dateRangeSchema,
  parseSearchParams,
} from '@/lib/validation';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate player ID
    const idValidation = playerIdSchema.safeParse(id);
    if (!idValidation.success) {
      return NextResponse.json(
        { error: 'Invalid player ID' },
        { status: 400 }
      );
    }

    // Validate date range params
    const queryParams = parseSearchParams(request.nextUrl.searchParams);
    const dateValidation = dateRangeSchema.safeParse(queryParams);
    if (!dateValidation.success) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: dateValidation.error.flatten() },
        { status: 400 }
      );
    }

    // Get player base info
    const player = await getPlayer(id);
    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    // Get player stats with date range filters
    const stats = await getPlayerStats(id, dateValidation.data);

    return NextResponse.json({ player, stats });
  } catch (error) {
    console.error('Error fetching player:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
