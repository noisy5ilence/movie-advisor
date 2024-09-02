export interface YTSResponse {
  status: Stat;
  status_message: string;
  data: Data;
  '@meta': Meta;
}

export interface Meta {
  server_time: number;
  server_timezone: string;
  api_version: number;
  execution_time: string;
}

export interface Data {
  movie_count: number;
  limit: number;
  page_number: number;
  movies: Movie[];
}

export interface Movie {
  id: number;
  url: string;
  imdb_code: string;
  title: string;
  title_english: string;
  title_long: string;
  slug: string;
  year: number;
  rating: number;
  runtime: number;
  genres: string[];
  summary: string;
  description_full: string;
  synopsis: string;
  yt_trailer_code: string;
  language: Language;
  mpa_rating: MpaRating;
  background_image: string;
  background_image_original: string;
  small_cover_image: string;
  medium_cover_image: string;
  large_cover_image: string;
  state: Stat;
  torrents: Torrent[];
  date_uploaded: Date;
  date_uploaded_unix: number;
}

export enum Language {
  En = 'en',
  Ja = 'ja'
}

export enum MpaRating {
  Empty = '',
  PG13 = 'PG-13',
  R = 'R'
}

export enum Stat {
  Ok = 'ok'
}

export interface Torrent {
  url: string;
  hash: string;
  quality: Quality;
  type: Type;
  is_repack: string;
  video_codec: VideoCodec;
  bit_depth: string;
  audio_channels: string;
  seeds: number;
  peers: number;
  size: string;
  size_bytes: number;
  date_uploaded: Date;
  date_uploaded_unix: number;
}

export enum Quality {
  The1080P = '1080p',
  The2160P = '2160p',
  The3D = '3D',
  The720P = '720p'
}

export enum Type {
  Bluray = 'bluray',
  Web = 'web'
}

export enum VideoCodec {
  X264 = 'x264',
  X265 = 'x265'
}
