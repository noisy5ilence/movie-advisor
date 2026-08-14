import { NextRequest, NextResponse } from 'next/server';

import { MOVIE_DB_API_URL, MOVIE_DB_TOKEN } from '@/env';
import { PRIVATE_CACHE_CONTROL, PUBLIC_CACHE_CONTROL, REVALIDATE } from '@/lib/cache';

import trim from './trim';

type TMDBParams = {
  params: {
    path: string[];
  };
};

const upstream = (path: string[], searchParams: URLSearchParams) => {
  const params = new URLSearchParams(searchParams);

  params.delete('preventCache');

  const query = params.toString();

  return `${MOVIE_DB_API_URL}/${path.join('/')}${query ? `?${query}` : ''}`;
};

const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${MOVIE_DB_TOKEN}` };

export async function GET({ nextUrl: { searchParams } }: NextRequest, { params: { path } }: TMDBParams) {
  const isPrivate = Boolean(searchParams.get('preventCache') || searchParams.get('session_id'));

  try {
    const response = await fetch(upstream(path, searchParams), {
      headers,
      next: isPrivate ? undefined : { revalidate: REVALIDATE }
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch data from TMDb' }, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json(trim(path.join('/'), data), {
      headers: { 'Cache-Control': isPrivate ? PRIVATE_CACHE_CONTROL : PUBLIC_CACHE_CONTROL }
    });
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params: { path } }: TMDBParams) {
  try {
    const requestBody = await request.json();

    const response = await fetch(upstream(path, request.nextUrl.searchParams), {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to post data to TMDb' }, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json(data, { headers: { 'Cache-Control': PRIVATE_CACHE_CONTROL } });
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
