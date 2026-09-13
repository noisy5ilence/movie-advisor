import { useQuery } from '@tanstack/react-query';

import { Sort } from '@/data/parsers';
import analytics from '@/lib/analytics';
import useTrackOnce from '@/lib/analytics/useTrackOnce';

const useTorrents = ({
  query,
  sort,
  imdbID,
  type,
  key,
  queryFn,
  show
}: {
  key: string;
  query: string;
  sort: Sort;
  imdbID: string;
  type?: Show['type'];
  show: { id: Show['id']; type: Show['type']; title: Show['title'] };
  queryFn: (params: { query: string; sort: Sort; imdbID: string; type?: Show['type'] }) => Promise<Torrent[]>;
}) => {
  const result = useQuery({
    enabled: Boolean(query),
    queryKey: [key, query, sort, imdbID, type],
    queryFn: () => queryFn({ query, sort, imdbID, type })
  });

  useTrackOnce(analytics.torrentsSearched, result.data ? `${key}:${query}` : undefined, () => ({
    showId: show.id,
    showType: show.type,
    showTitle: show.title,
    provider: key,
    results: result.data?.length ?? 0
  }));

  return result;
};

export default useTorrents;
