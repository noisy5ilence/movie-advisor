import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import API from './api';

const useTorrents = ({ query }: { query: string }) => {
  const { data: trackersTorrents, ...tracker } = useQuery({
    enabled: Boolean(query),
    queryKey: ['tracker', query],
    queryFn: () => API.torrents.tracker({ query })
  });

  const { data: piratesTorrents, ...pirateBay } = useQuery({
    enabled: Boolean(query),
    queryKey: ['pirate-bay', query],
    queryFn: () => API.torrents.pirateBay({ query })
  });

  return {
    torrents: useMemo(
      () => [...(trackersTorrents || []), ...(piratesTorrents || [])],
      [trackersTorrents, piratesTorrents]
    ),
    isLoading: tracker.isLoading || pirateBay.isLoading,
    isFetched: tracker.isFetched && pirateBay.isFetched
  };
};

export default useTorrents;
