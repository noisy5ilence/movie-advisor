import { getServerSideSitemap, ISitemapField } from 'next-sitemap';

import { MOVIE_DB_API_URL, MOVIE_DB_TOKEN, SITE_URL } from '@/env';
import { showPath } from '@/lib/utils';

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

type TMDBListItem = { id: number; title?: string; name?: string };
type TMDBListResponse = { results?: TMDBListItem[] };

type Entry = { id: number; title: string };

const fetchEntries = async (path: string, params: Record<string, string>): Promise<Entry[]> => {
  const query = new URLSearchParams(params).toString();

  const response = await fetch(`${MOVIE_DB_API_URL}/${path}?${query}`, {
    headers: { Authorization: `Bearer ${MOVIE_DB_TOKEN}` },
    next: { revalidate }
  });

  if (!response.ok) throw new Error(`TMDB ${path} responded with ${response.status}`);

  const { results = [] }: TMDBListResponse = await response.json();

  return results.map(({ id, title, name }) => ({ id, title: title || name || '' }));
};

// TMDB allows ~50 requests per second, so the task list is drained in small batches
const collectEntries = async (tasks: (() => Promise<Entry[]>)[]) => {
  const entries = new Map<number, string>();

  for (let index = 0; index < tasks.length; index += BATCH_SIZE) {
    const batch = await Promise.all(tasks.slice(index, index + BATCH_SIZE).map((task) => task().catch(() => [])));

    batch.flat().forEach(({ id, title }) => entries.has(id) || entries.set(id, title));
  }

  return Array.from(entries, ([id, title]) => ({ id, title }));
};

const pages = (count: number) => Array.from({ length: count }, (_, index) => `${index + 1}`);

const discoverTasks = (type: Show['type']) =>
  ['popularity.desc', 'vote_average.desc'].flatMap((sortBy) =>
    pages(LIST_PAGES).map(
      (page) => () => fetchEntries(`discover/${type}`, { ...DISCOVER_FILTERS, sort_by: sortBy, page })
    )
  );

export async function GET() {
  const movies = await collectEntries(discoverTasks('movie'));
  const series = await collectEntries(discoverTasks('tv'));
  const persons = await collectEntries(
    pages(PERSON_PAGES).map((page) => () => fetchEntries('person/popular', { page }))
  );

  const fields: ISitemapField[] = [
    ...movies.map(({ id, title }) => `${SITE_URL}${showPath({ type: 'movie', id, title })}`),
    ...series.map(({ id, title }) => `${SITE_URL}${showPath({ type: 'tv', id, title })}`),
    ...persons.map(({ id }) => `${SITE_URL}/person/${id}`)
  ].map((loc) => ({ loc }));

  return getServerSideSitemap(fields);
}
