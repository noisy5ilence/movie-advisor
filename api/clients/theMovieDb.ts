import Http from './Http';

const theMovieDb = new Http('https://api.themoviedb.org/3', `Bearer ${process.env.MOVIE_DB_TOKEN}`);

export default theMovieDb;
