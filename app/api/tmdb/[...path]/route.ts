import { NextRequest, NextResponse } from 'next/server';

type TMDBParams = {
  params: {
    path: string[];
  };
};

export async function GET({ nextUrl: { searchParams } }: NextRequest, { params: { path } }: TMDBParams) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/${path.join('/')}?${searchParams.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.MOVIE_DB_TOKEN}`
      }
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
