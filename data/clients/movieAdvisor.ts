import Http from './Http';

const BASE =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
    : process.env.NEXT_PUBLIC_VERCEL_URL;

const movieAdvisor = new Http(`${BASE?.startsWith('http') ? BASE : `https://${BASE}`}/api/tmdb`);

export default movieAdvisor;
