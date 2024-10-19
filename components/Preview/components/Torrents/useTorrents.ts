import { useQuery } from '@tanstack/react-query';

import { Sort } from '@/api/parsers';

const useTorrents = ({
  query,
  sort,
  imdbID,
  key,
  queryFn
}: {
  key: string;
  query: string;
  sort: Sort;
  imdbID: string;
  queryFn: (params: { query: string; sort: Sort; imdbID: string }) => Promise<Torrent[]>;
}) => {
  return useQuery({
    enabled: Boolean(query),
    queryKey: [key, query, sort, imdbID],
    queryFn: () => queryFn({ query, sort, imdbID })
  });
};

export default useTorrents;
