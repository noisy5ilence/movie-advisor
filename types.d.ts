type Theme = 'light' | 'dark';

interface TMDBPagination<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

interface Pagination<T> {
  page: number;
  total: number;
  results: T[];
}

interface Details {
  genres: IDName[];
  imdb_id: string;
  runtime: number;
  tagline: string;
}

interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: Date;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface Series {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  first_air_date: Date;
  name: string;
  vote_average: number;
  vote_count: number;
}

interface Show {
  type: 'movie' | 'tv';
  id: number;
  title: string;
  overview: string;
  backdrop: string;
  poster: string;
  release: Date;
  rating: number;
  votes: number;
}

interface Person {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  cast_id: number;
  credit_id: string;
  order: number;
}

interface Actor extends Person {
  character: string;
}

interface AggregatedActor extends Person {
  roles: Role[];
  total_episode_count: number;
}

interface Role {
  credit_id: string;
  character: string;
  episode_count: number;
}

interface Trailer {
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: Date;
  id: string;
}

interface IDName<T = number> {
  id: T;
  name: string;
}

interface Torrent {
  id: string;
  title: string;
  seeders: number;
  size: string;
  magnet: string;
  type: 'web' | 'bluray';
}

interface Source {
  name: string;
  src: string;
}

interface Subtitles {
  name: string;
  content: string;
}

interface Video extends Source {
  subtitles: Subtitles[];
}

interface ExternalIDS {
  id: number;
  imdb_id: string;
  wikidata_id: string;
  facebook_id: string;
  instagram_id: string;
  twitter_id: string;
}
