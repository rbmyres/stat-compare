import { NextRequest, NextResponse } from 'next/server';
import { getPlayers } from '@/lib/db/client';
import { searchSchema, parseSearchParams } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    const params = parseSearchParams(request.nextUrl.searchParams);
    const validation = searchSchema.safeParse(params);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { q, limit } = validation.data;
    const players = await getPlayers(q, limit);

    return NextResponse.json({ players });
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
