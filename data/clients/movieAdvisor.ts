import { isServer } from '@tanstack/react-query';

import Http from './Http';

const BASE =
  process.env.NEXT_VERCEL_ENV === 'production'
    ? process.env.NEXT_VERCEL_PROJECT_PRODUCTION_URL
    : process.env.NEXT_VERCEL_URL;

const ROOT = isServer ? `${BASE?.startsWith('http') ? BASE : `https://${BASE}`}` : '';

const movieAdvisor = new Http(`${ROOT}/api/tmdb`);

export default movieAdvisor;
