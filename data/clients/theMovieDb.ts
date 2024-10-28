import { MOVIE_DB_API_URL, MOVIE_DB_TOKEN } from '@/env';

import Http from './Http';

const theMovieDB = new Http(MOVIE_DB_API_URL, `Bearer ${MOVIE_DB_TOKEN}`);

export default theMovieDB;
