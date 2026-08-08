import { useQuery } from '@tanstack/react-query';

import { parseSeasonEpisode } from '@/lib/utils';

interface Props {
  show?: Show & Partial<Details>;
  episodes?: string;
  filename?: string;
}

export const useSubtitles = ({ show, episodes, filename }: Props): Source[] => {
  const fromFile = parseSeasonEpisode(filename);
  const fromTorrent = parseSeasonEpisode(episodes);

  const season = fromFile.season ?? fromTorrent.season;
  const episode = fromFile.episode ?? fromTorrent.episode;

  const isSeries = show?.type === 'tv';
  const enabled = Boolean(show?.id && (!isSeries || (season != null && episode != null)));

  const { data } = useQuery<Source[]>({
    enabled,
    staleTime: Infinity,
    retry: false,
    queryKey: ['subtitles', show?.type, show?.id, season, episode],
    queryFn: () => {
      const params = new URLSearchParams({ type: show!.type, tmdb_id: show!.id.toString() });

      if (show!.imdb_id) params.set('imdb_id', show!.imdb_id);

      if (isSeries) {
        params.set('season', season!.toString());
        params.set('episode', episode!.toString());
      }

      return fetch(`/api/subtitles?${params}`).then((response) => (response.ok ? response.json() : []));
    }
  });

  return data ?? [];
};
