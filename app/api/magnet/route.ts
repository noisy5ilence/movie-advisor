import { NextRequest, NextResponse } from 'next/server';

import tlk from '@/api/parsers/tlk';

export async function GET({ nextUrl: { searchParams } }: NextRequest) {
  const url = searchParams.get('url') as string;

  try {
    return NextResponse.json(await tlk.magnet(url));
  } catch (_) {
    console.log('error', _);
    return NextResponse.json([]);
  }
}
