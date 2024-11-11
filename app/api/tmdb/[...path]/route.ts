import { NextRequest, NextResponse } from 'next/server';

import { MOVIE_DB_API_URL, MOVIE_DB_TOKEN } from '@/env';

type TMDBParams = {
  params: {
    path: string[];
  };
};

export async function GET({ nextUrl: { searchParams } }: NextRequest, { params: { path } }: TMDBParams) {
  try {
    const params = searchParams.toString();
    const response = await fetch(`${MOVIE_DB_API_URL}/${path.join('/')}${params ? `?${params}` : ''}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MOVIE_DB_TOKEN}`
      },
      next: searchParams.get('preventCache') || searchParams.get('session_id') ? undefined : { revalidate: 3600 }
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch data from TMDb' }, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params: { path } }: TMDBParams) {
  try {
    const requestBody = await request.json();
    const searchParams = request.nextUrl.searchParams.toString();

    const response = await fetch(`${MOVIE_DB_API_URL}/${path.join('/')}?${searchParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MOVIE_DB_TOKEN}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to post data to TMDb' }, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
