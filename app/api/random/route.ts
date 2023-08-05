import { NextResponse } from 'next/server';

import server from '@/network/server';

export async function GET(request: Request) {
  const params = Object.fromEntries(new URL(request.url).searchParams.entries());
  const fetch = (): Promise<Movie[]> => {
    return server
      .get('/discover/movie', {
        params: {
          sort_by: 'popularity.desc',
          page: Math.floor(Math.random() * 1000) + 1,
          ...params
        }
      })
      .then((data: unknown) => {
        const response: MovieDBResponse = data as MovieDBResponse;

        if (!response?.results || !response?.results.length) {
          return fetch();
        }

        return response.results;
      })
      .catch(fetch) as Promise<Movie[]>;
  };

  return NextResponse.json(await fetch());
}

export const revalidate = 0;
