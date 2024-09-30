'use client';

import { topMovies } from '@/api';
import useInfiniteList from '@/hooks/useInfiniteList';

const useStarring = ({ actorId }: { actorId?: string }) =>
  useInfiniteList({
    queryKey: ['starring', actorId],
    enabled: Boolean(actorId),
    queryFn: ({ page }) => {
      return topMovies({ page, starring: actorId });
    }
  });

export default useStarring;
