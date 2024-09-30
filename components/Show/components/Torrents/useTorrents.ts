import { useQuery } from '@tanstack/react-query';

import { Sort } from '@/api/parsers';

const useTorrents = ({
  query,
  sort,
  showId,
  showType,
  key,
  queryFn
}: {
  showId: Show['id'];
  showType: Show['type'];
  key: string;
  query: string;
  sort: Sort;
  queryFn: (params: { query: string; sort: Sort; showId: Show['id']; showType: Show['type'] }) => Promise<Torrent[]>;
}) => {
  return useQuery({
    enabled: Boolean(query),
    queryKey: [key, query, sort, showId, showType],
    queryFn: () => queryFn({ query, sort, showId, showType })
  });
};

export default useTorrents;
