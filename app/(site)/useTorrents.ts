import { useQuery } from '@tanstack/react-query';

import { Sort } from '@/lib/api/parsers';

const useTorrents = ({
  query,
  sort,
  id,
  type,
  key,
  queryFn
}: {
  type: ShowType;
  key: string;
  id: number;
  query: string;
  sort: Sort;
  queryFn: (params: { query: string; sort: Sort; id: number; type: ShowType }) => Promise<Torrent[]>;
}) => {
  return useQuery({
    enabled: Boolean(query),
    queryKey: [key, query, sort, id, type],
    queryFn: () => queryFn({ query, sort, id, type })
  });
};

export default useTorrents;
