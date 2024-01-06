import { useQuery } from '@tanstack/react-query';

import { torrents } from '@/lib/api';
import { ORDER } from '@/lib/api/parsers/pirate-bay';

const useTorrents = ({ query, order }: { query: string; order: ORDER }) => {
  return useQuery({
    enabled: Boolean(query),
    queryKey: ['pirate-bay', query, order],
    queryFn: () => torrents({ query, order })
  });
};

export default useTorrents;
