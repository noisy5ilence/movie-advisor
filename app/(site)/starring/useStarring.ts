'use client';

import { topMovies } from '@/api';
import useInfiniteList from '@/hooks/useInfiniteList';

const useStarring = ({ actorId }: { actorId?: string }) =>
  useInfiniteList({
    suspense: true,
    queryKey: ['starring', actorId],
    enabled: Boolean(actorId),
    queryFn: ({ page }) => topMovies({ page, starring: actorId })
  });

export default useStarring;
