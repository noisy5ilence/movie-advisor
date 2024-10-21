'use client';

import { similarShows } from '@/api';
import useInfiniteList from '@/hooks/useInfiniteList';

interface Props {
  showId: string;
  showType: Show['type'];
}

const useSimilar = ({ showId, showType = 'movie' }: Props) =>
  useInfiniteList({
    suspense: true,
    enabled: Boolean(showId),
    queryKey: ['similar', showId, showType],
    queryFn: ({ page }) => similarShows({ page, showId, showType })
  });

export default useSimilar;
