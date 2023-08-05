import { NextResponse } from 'next/server';

import server from '@/network/server';

export async function GET(request: Request) {
  const response: { genres: IDName[] } = await server.get('/genre/movie/list');

  return NextResponse.json(response.genres);
}

export const revalidate = 3600 * 24;
