import { MOVIE_DB_TOKEN } from '@/env';

import Http from './Http';

const theMovieDb = new Http('https://api.themoviedb.org/3', `Bearer ${MOVIE_DB_TOKEN}`);

export default theMovieDb;
