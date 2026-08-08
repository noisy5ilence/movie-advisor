import { NextRequest, NextResponse } from 'next/server';

import { searchSubtitles } from '@/data/clients/openSubtitles';
import { SUBTITLE_LANGUAGES } from '@/env';

export async function GET({ nextUrl: { searchParams } }: NextRequest) {
  const imdbId = searchParams.get('imdb_id') || undefined;
  const tmdbId = searchParams.get('tmdb_id') || undefined;

  if (!imdbId && !tmdbId) {
    return NextResponse.json({ error: 'imdb_id or tmdb_id is required' }, { status: 400 });
  }

  const season = searchParams.get('season');
  const episode = searchParams.get('episode');

  try {
    const subtitles = await searchSubtitles({
      type: searchParams.get('type') === 'tv' ? 'tv' : 'movie',
      imdbId,
      tmdbId,
      season: season ? Number(season) : undefined,
      episode: episode ? Number(episode) : undefined,
      languages: searchParams.get('languages') || SUBTITLE_LANGUAGES
    });

    return NextResponse.json(subtitles, {
      headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400' }
    });
  } catch (error) {
    console.error('[subtitles] search', error);
    return NextResponse.json({ error: 'Failed to search subtitles' }, { status: 502 });
  }
}
