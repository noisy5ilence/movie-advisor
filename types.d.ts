type Theme = 'light' | 'dark' | 'system';

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
  photoUrl: string;
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
  originalTitle?: string;
  seeders: number;
  size: string;
  magnet: string;
  quality?: string;
  source?: string;
  codec?: string;
  container?: string;
  year?: string;
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

interface Stream {
  title: string;
  category: string;
  poster: string;
  timestamp: number;
  name: string;
  hash: string;
  stat: number;
  stat_string: string;
  torrent_size: number;
  total_peers: number;
  pending_peers: number;
  active_peers: number;
  half_open_peers: number;
  bytes_written: number;
  bytes_read: number;
  file_stats: FileStat[];
}

interface FileStat {
  id: number;
  path: string;
  length: number;
}
