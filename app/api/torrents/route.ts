import { NextRequest, NextResponse } from 'next/server';

import { Sort } from '@/api/parsers';
import tlk from '@/api/parsers/tlk';
import tpb from '@/api/parsers/tpb';
import yts from '@/api/parsers/yts';

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
