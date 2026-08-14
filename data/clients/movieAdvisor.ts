import { isServer } from '@tanstack/react-query';

import { MOVIE_DB_API_URL, MOVIE_DB_TOKEN } from '@/env';

import Http from './Http';

const movieAdvisor = isServer ? new Http(MOVIE_DB_API_URL, `Bearer ${MOVIE_DB_TOKEN}`) : new Http('/api/tmdb');

export default movieAdvisor;
