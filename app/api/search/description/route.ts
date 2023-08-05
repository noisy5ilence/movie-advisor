import { NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai';

import server from '@/network/server';

export async function GET(request: Request) {
  const params = Object.fromEntries(new URL(request.url).searchParams.entries());

  const openai = new OpenAIApi(new Configuration({ apiKey: process.env.CHAT_GPT_KEY }));

  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Based on the movie description: ${params.description}, suggest 5 movies. Format of suggestions: only title separated by comma`,
      max_tokens: 70,
      temperature: 0.4,
      stop: ['Based on the movie description:']
    });

    const suggestedMovies = (completion.data.choices[0].text?.split(',') || []).map((movie) =>
      movie.replace(/^\s*\d+\.\s*/, '')
    );

    if (!suggestedMovies.length) return NextResponse.json([]);

    const movies = await Promise.allSettled(
      suggestedMovies.map((movie) =>
        server
          .get('/search/movie', {
            params: {
              query: movie
            }
          })
          .then((response: unknown) => {
            const data = response as MovieDBResponse;

            return (data?.results || []).slice(0, 1);
          })
      )
    ).then((results) => {
      return results.reduce((movies, result) => {
        if (result.status !== 'fulfilled') return movies;

        movies.push(...result.value);

        return movies;
      }, [] as Movie[]);
    });

    return NextResponse.json(movies);
  } catch (error) {
    return NextResponse.json([]);
  }
}
