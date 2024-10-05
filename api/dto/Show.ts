const mapMoviesSeriesResponseToShows = (
  { total_pages, page, results }: TMDBPagination<Movie> | TMDBPagination<Series>,
  type: Show['type'] = 'movie'
): Pagination<Show> => ({
  page,
  total: total_pages,
  results: results
    .map(({ id, overview, backdrop_path, poster_path, vote_average, vote_count, ...item }) => ({
      id,
      type,
      overview,
      rating: vote_average,
      votes: vote_count,
      backdrop: backdrop_path ? `https://image.tmdb.org/t/p/w1280/${backdrop_path}` : '',
      poster: poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : '',
      release: 'release_date' in item ? item.release_date : item.first_air_date,
      title: 'release_date' in item ? item.title : item.name,
      genres: []
    }))
    .filter((show) => show.votes && show.release && show.backdrop && show.poster)
});

export default mapMoviesSeriesResponseToShows;