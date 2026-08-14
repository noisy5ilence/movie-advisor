export const REVALIDATE = 3600;

const STALE_WHILE_REVALIDATE = 86400;

export const PUBLIC_CACHE_CONTROL = `public, s-maxage=${REVALIDATE}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`;

export const PRIVATE_CACHE_CONTROL = 'private, no-store';
