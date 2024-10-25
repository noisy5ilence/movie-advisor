import { NextRequest } from 'next/server';

import { Sort } from '@/api/parsers';
import pirateBay from '@/api/parsers/pirate-bay';
import toloka from '@/api/parsers/toloka';
import yts from '@/api/parsers/yts';

export async function GET({ nextUrl: { searchParams } }: NextRequest) {
  const key = searchParams.get('key') as keyof typeof providers;
  const imdbID = searchParams.get('imdbID') as string;
  const query = searchParams.get('query') as string;
  const sort = searchParams.get('sort') as Sort;

  const providers = { yts: yts, tpb: pirateBay, tlk: toloka };

  try {
    return Response.json(await providers[key].search({ imdbID, query, sort }));
  } catch (_) {
    return Response.json([]);
  }
}
