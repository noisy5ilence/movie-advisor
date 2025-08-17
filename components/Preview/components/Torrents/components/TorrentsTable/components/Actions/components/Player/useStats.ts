import { useQuery } from '@tanstack/react-query';

import { PRELOAD_CACHE_LIMIT } from '@/env';
import { useStreamUrl } from '@/hooks/useStreamUrl';
import { formatBytes } from '@/lib/utils';

interface Props {
  hash?: string;
  canPlay: boolean;
}

export enum StreamStatus {
  init = 1,
  preload = 2,
  ready = 3
}

export const useStats = ({ hash, canPlay }: Props) => {
  const streamUrl = useStreamUrl();

  const { data } = useQuery<Stream & { stat: StreamStatus }>({
    enabled: Boolean(hash),
    queryKey: ['stats', hash],
    refetchInterval: ({ state }) => {
      if (state.data?.stat === StreamStatus.ready && canPlay) return false;

      return 1000;
    },
    queryFn: () =>
      fetch(`${streamUrl}/torrents`, {
        method: 'POST',
        body: JSON.stringify({
          action: 'get',
          hash
        })
      }).then((response) => response.json())
  });

  const preloadCacheLimitBytes = PRELOAD_CACHE_LIMIT * 1_048_576;

  return {
    isReady: data?.stat === StreamStatus.ready,
    downloadSpeed: data?.download_speed ? `${formatBytes(data?.download_speed)}/s` : '',
    peers: [(data?.active_peers ?? 0) + (data?.half_open_peers ?? 0), data?.total_peers].filter(Boolean).join('/'),
    preloadingProgress: Math.min(
      data?.preloaded_bytes ? (data?.preloaded_bytes * 100) / preloadCacheLimitBytes : 0,
      100
    )
  };
};
