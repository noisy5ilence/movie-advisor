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
      backdrop: backdrop_path,
      poster: poster_path,
      rating: vote_average,
      votes: vote_count,
      release: 'release_date' in item ? item.release_date : item.first_air_date,
      title: 'release_date' in item ? item.title : item.name,
      genres: []
    }))
    .filter((show) => show.votes && show.release)
});

export default mapMoviesSeriesResponseToShows;
