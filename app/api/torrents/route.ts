import { NextRequest, NextResponse } from 'next/server';

import { Sort } from '@/data/parsers';
import tlk from '@/data/parsers/tlk';
import tpb from '@/data/parsers/tpb';
import yts from '@/data/parsers/yts';

export async function GET({ nextUrl: { searchParams } }: NextRequest) {
  const key = searchParams.get('key') as keyof typeof providers;

  const imdbID = searchParams.get('imdbID') as string;
  const query = searchParams.get('query') as string;
  const sort = searchParams.get('sort') as Sort;

  const providers = { yts, tpb, tlk };

  try {
    return NextResponse.json(await providers[key].search({ imdbID, query, sort }));
  } catch (_) {
    return NextResponse.json([]);
  }
}
