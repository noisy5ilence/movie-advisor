import { useQuery } from '@tanstack/react-query';

import { Sort } from '@/data/parsers';
import useTrackOnce from '@/lib/analytics/useTrackOnce';

const useTorrents = ({
  query,
  sort,
  imdbID,
  key,
  queryFn,
  show
}: {
  key: string;
  query: string;
  sort: Sort;
  imdbID: string;
  show: { id: Show['id']; type: Show['type'] };
  queryFn: (params: { query: string; sort: Sort; imdbID: string }) => Promise<Torrent[]>;
}) => {
  const result = useQuery({
    enabled: Boolean(query),
    queryKey: [key, query, sort, imdbID],
    queryFn: () => queryFn({ query, sort, imdbID })
  });

  useTrackOnce('torrents_searched', result.data ? `${key}:${query}` : undefined, () => ({
    showId: show.id,
    showType: show.type,
    provider: key,
    results: result.data?.length ?? 0
  }));

  return result;
};

export default useTorrents;
