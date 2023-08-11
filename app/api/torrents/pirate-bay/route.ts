import { NextResponse } from 'next/server';
import PirateBay from 'thepiratebayfixed';

export async function GET(request: Request) {
  const params = Object.fromEntries(new URL(request.url).searchParams.entries());

  try {
    const results: PirateTorrent[] = await PirateBay.search(params.query, {
      category: 'video'
    });

    return NextResponse.json(
      results?.map(({ seeders, name, id, magnetLink, size }) => ({
        id,
        title: name,
        magnetLink,
        size,
        seeders: parseInt(seeders)
      })) || []
    );
  } catch (error) {
    return NextResponse.json([]);
  }
}

export const revalidate = 0;
