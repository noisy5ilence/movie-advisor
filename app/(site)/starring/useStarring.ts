'use client';

import popularQuery from '@/api/queries/popular';
import useInfiniteList from '@/hooks/useInfiniteList';

const useStarring = ({ actorId }: { actorId?: string }) =>
  useInfiniteList(popularQuery({ sortBy: 'vote_average.desc', starring: actorId }));

export default useStarring;
