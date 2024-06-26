type Theme = 'light' | 'dark';

interface MovieDBResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

type ShowType = 'movie' | 'tv';

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
  first_air_date?: Date;
  title: string;
  name?: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface Actor {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

interface AggregatedActor {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  roles: Role[];
  total_episode_count: number;
  order: number;
}

interface Role {
  credit_id: string;
  character: string;
  episode_count: number;
}

interface Person {
  adult: boolean;
  also_known_as: string[];
  biography: string;
  birthday: Date;
  deathday: null;
  gender: number;
  homepage: null;
  id: number;
  imdb_id: string;
  known_for_department: string;
  name: string;
  place_of_birth: string;
  popularity: number;
  profile_path: string;
}

interface Trailer {
  iso_639_1: string;
  iso_3166_1: string;
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

interface TrackerTorrent {
  author: string;
  category: string;
  id: string;
  leeches: number;
  seeds: number;
  size: number;
  state: string;
  title: string;
  downloads: number;
  registered: Date;
  host: string;
}

interface PirateTorrent {
  id: string;
  name: string;
  size: string;
  link: string;
  category: Category;
  seeders: string;
  leechers: string;
  uploadDate: Date;
  magnetLink: string;
  subcategory: Category;
  uploader: string;
  verified: boolean;
  uploaderLink: string;
}

interface Torrent {
  id: string;
  title: string;
  seeders: number;
  size: string;
  magnet: string;
}

interface Category {
  id: string;
  name: string;
}

interface Poster {
  aspect_ratio: number;
  height: number;
  iso_639_1: null;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

interface Filters {
  genres: Array<string>;
  year: Array<string>;
  score: Array<string>;
}
