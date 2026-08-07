import { getServerSideSitemap, ISitemapField } from 'next-sitemap';

import { MOVIE_DB_API_URL, MOVIE_DB_TOKEN, SITE_URL } from '@/env';

export const revalidate = 86400;

const LIST_PAGES = 25;
const PERSON_PAGES = 10;
const BATCH_SIZE = 20;

// Mirrors the discover filters used by the /popular and /top pages (data/queries/popular.ts)
const DISCOVER_FILTERS = {
  'vote_count.gte': '300',
  'vote_average.gte': '5',
  'vote_average.lte': '10'
};

type TMDBListResponse = { results?: { id: number }[] };

const fetchIds = async (path: string, params: Record<string, string>): Promise<number[]> => {
  const query = new URLSearchParams(params).toString();

  const response = await fetch(`${MOVIE_DB_API_URL}/${path}?${query}`, {
    headers: { Authorization: `Bearer ${MOVIE_DB_TOKEN}` },
    next: { revalidate }
  });

  if (!response.ok) throw new Error(`TMDB ${path} responded with ${response.status}`);

  const { results = [] }: TMDBListResponse = await response.json();

  return results.map(({ id }) => id);
};

// TMDB allows ~50 requests per second, so the task list is drained in small batches
const collectIds = async (tasks: (() => Promise<number[]>)[]) => {
  const ids: number[] = [];

  for (let index = 0; index < tasks.length; index += BATCH_SIZE) {
    const batch = await Promise.all(tasks.slice(index, index + BATCH_SIZE).map((task) => task().catch(() => [])));

    ids.push(...batch.flat());
  }

  return Array.from(new Set(ids));
};

const pages = (count: number) => Array.from({ length: count }, (_, index) => `${index + 1}`);

const discoverTasks = (type: Show['type']) =>
  ['popularity.desc', 'vote_average.desc'].flatMap((sortBy) =>
    pages(LIST_PAGES).map((page) => () => fetchIds(`discover/${type}`, { ...DISCOVER_FILTERS, sort_by: sortBy, page }))
  );

export async function GET() {
  const movieIds = await collectIds(discoverTasks('movie'));
  const seriesIds = await collectIds(discoverTasks('tv'));
  const personIds = await collectIds(pages(PERSON_PAGES).map((page) => () => fetchIds('person/popular', { page })));

  const fields: ISitemapField[] = [
    ...movieIds.map((id) => `${SITE_URL}/movie/${id}`),
    ...seriesIds.map((id) => `${SITE_URL}/tv/${id}`),
    ...personIds.map((id) => `${SITE_URL}/person/${id}`)
  ].map((loc) => ({ loc }));

  return getServerSideSitemap(fields);
}
