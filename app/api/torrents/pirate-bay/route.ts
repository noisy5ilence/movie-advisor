import { NextResponse } from 'next/server';

import pirateBay from '../parsers/pirate-bay';

export async function GET(request: Request) {
  const params = Object.fromEntries(new URL(request.url).searchParams.entries());

  try {
    const torrents = await pirateBay.search({ query: params.query });
    return NextResponse.json(torrents);
  } catch (error) {
    return NextResponse.json([]);
  }
}

export const revalidate = 0;
