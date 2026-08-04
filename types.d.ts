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
  availability?: Availability;
  airing?: Airing;
}

interface TMDBEpisode {
  air_date: string | null;
  episode_number: number;
  season_number: number;
  name: string;
}

interface TMDBSeriesDetails {
  last_episode_to_air?: TMDBEpisode | null;
  next_episode_to_air?: TMDBEpisode | null;
  number_of_seasons?: number;
  status?: string;
}

/** Where a series currently stands — the latest aired episode plus what follows it */
interface Airing {
  season: number;
  episode: number;
  seasons: number;
  ended: boolean;
  /** air date of the next episode, ISO string, only when TMDB knows one */
  next?: string;
}

interface TMDBReleaseDate {
  certification: string;
  iso_639_1: string;
  note: string;
  release_date: string;
  type: number;
}

interface TMDBCountryReleaseDates {
  iso_3166_1: string;
  release_dates: TMDBReleaseDate[];
}

type AvailabilityState = 'theatre' | 'stream' | 'bluray';

/** Earliest worldwide release date per window, ISO strings */
type Availability = Partial<Record<AvailabilityState, string>>;

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
  poster: { '1x': string; '1.5x': string; '2x': string };
  release: Date;
  rating: number;
  votes: number;
}

interface ShowState {
  id: number;
  favorite: boolean;
  rated: boolean;
  watchlist: boolean;
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
  credit_id: string;
  // crew members carry neither
  cast_id?: number;
  order?: number;
}

interface Crew extends Person {
  department: string;
  /** movie credits carry a single job, tv aggregate credits carry one entry per job */
  job?: string;
  jobs?: Array<{ credit_id: string; job: string; episode_count: number }>;
  total_episode_count?: number;
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
  size?: string;
  magnet: string;
  quality?: string;
  source?: string;
  codec?: string;
  container?: string;
  year?: string;
  download?: string;
  hash: string;
}

interface Source {
  name: string;
  src: string;
  type: string;
}

interface Sources {
  playlist: Source[];
  subtitles: Source[];
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
  download_speed: number;
  preloaded_bytes: number;
}

interface FileStat {
  id: number;
  path: string;
  length: number;
}

interface RequestToken {
  success: boolean;
  expires_at: string;
  request_token: string;
}

interface Session {
  session_id: string;
}

interface Account {
  id: number;
  name: string;
  username: string;
  avatar: Avatar;
}
