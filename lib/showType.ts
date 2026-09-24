export const SERIES_PREFIX = '/series';

export const isSeriesPath = (pathname: string) =>
  pathname === SERIES_PREFIX || pathname.startsWith(`${SERIES_PREFIX}/`);

export const showTypeFromPath = (pathname: string): Show['type'] => (isSeriesPath(pathname) ? 'tv' : 'movie');

export const toShowTypePath = (pathname: string, type: Show['type']) => {
  const base = isSeriesPath(pathname) ? pathname.slice(SERIES_PREFIX.length) || '/' : pathname;

  return type === 'tv' ? (base === '/' ? SERIES_PREFIX : `${SERIES_PREFIX}${base}`) : base;
};
