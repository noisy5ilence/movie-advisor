const ENDED_STATUSES = ['Ended', 'Canceled'];

export const mapDetailsToAiring = ({
  last_episode_to_air,
  next_episode_to_air,
  number_of_seasons,
  status
}: TMDBSeriesDetails): Airing | undefined => {
  const current = last_episode_to_air || next_episode_to_air;

  if (!current) return undefined;

  return {
    season: current.season_number,
    episode: current.episode_number,
    seasons: number_of_seasons || current.season_number,
    ended: ENDED_STATUSES.includes(status || ''),
    next: next_episode_to_air?.air_date || undefined
  };
};

export default mapDetailsToAiring;
