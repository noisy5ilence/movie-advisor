const filterUnknownMovies = (movies: Movie[]): Movie[] => {
  return movies?.filter((movie) => movie?.vote_count && (movie?.release_date || movie?.first_air_date)) || [];
};

export default filterUnknownMovies;
