import { NextRequest, NextResponse } from 'next/server';

import { Sort } from '@/data/parsers';
import tlk from '@/data/parsers/tlk';
import tpb from '@/data/parsers/tpb';
import yts from '@/data/parsers/yts';

const MIN_SEEDERS = 5;

export async function GET({ nextUrl: { searchParams } }: NextRequest) {
  const key = searchParams.get('key') as keyof typeof providers;

  const imdbID = searchParams.get('imdbID') as string;
  const query = searchParams.get('query') as string;
  const sort = searchParams.get('sort') as Sort;

  const providers = { yts, tpb, tlk };

  try {
    const torrents = await providers[key].search({ imdbID, query, sort });

    return NextResponse.json(torrents.filter((torrent) => torrent.seeders >= MIN_SEEDERS));
  } catch (_) {
    return NextResponse.json([]);
  }
}
