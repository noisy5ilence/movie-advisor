import { NextResponse } from 'next/server';

import server from '@/network/server';

export async function GET(request: Request) {
  const params = Object.fromEntries(new URL(request.url).searchParams.entries());
  const response: { cast: Array<Actor> } = await server.get(`/movie/${params.movieId}/credits`);

  return NextResponse.json(response?.cast || []);
}

export const revalidate = 3600;
