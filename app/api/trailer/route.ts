import { NextResponse } from 'next/server';

import server from '@/network/server';

export async function GET(request: Request) {
  const params = Object.fromEntries(new URL(request.url).searchParams.entries());
  const response: { id: number; results: Trailer[] } = await server.get(`/movie/${params.movieId}/videos`, {
    params: {
      language: 'en-US'
    }
  });

  return NextResponse.json(response?.results || []);
}

export const revalidate = 3600 * 24;
