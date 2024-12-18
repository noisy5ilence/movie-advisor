import { NextRequest, NextResponse } from 'next/server';

import tlk from '@/data/parsers/tlk';

export async function GET({ nextUrl: { searchParams } }: NextRequest) {
  const url = searchParams.get('url') as string;

  try {
    return NextResponse.json(await tlk.magnet(url));
  } catch (error) {
    return NextResponse.error();
  }
}
