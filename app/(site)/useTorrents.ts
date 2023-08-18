import { useQuery } from '@tanstack/react-query';

import { ORDER } from '../api/torrents/parsers/pirate-bay';

import API from './api';

const useTorrents = ({ query, order }: { query: string; order: ORDER }) => {
  return useQuery({
    enabled: Boolean(query),
    queryKey: ['pirate-bay', query, order],
    queryFn: () => API.torrents.pirateBay({ query, order })
  });
};

export default useTorrents;
