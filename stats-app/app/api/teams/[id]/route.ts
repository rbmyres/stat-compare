import { NextRequest, NextResponse } from 'next/server';
import { getTeam, getTeamStats } from '@/lib/db/client';
import {
  teamIdSchema,
  dateRangeSchema,
  parseSearchParams,
} from '@/lib/validation';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate team ID (3-letter code)
    const idValidation = teamIdSchema.safeParse(id);
    if (!idValidation.success) {
      return NextResponse.json(
        { error: 'Invalid team ID. Must be a 3-letter team abbreviation (e.g., KC, BAL)' },
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

    const teamId = idValidation.data;

    // Get team base info
    const team = await getTeam(teamId);
    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    // Get team stats with date range filters
    const stats = await getTeamStats(teamId, dateValidation.data);

    return NextResponse.json({ team, stats });
  } catch (error) {
    console.error('Error fetching team:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
