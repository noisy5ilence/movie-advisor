'use client';

import similarQuery from '@/api/queries/similar';
import useInfiniteList from '@/hooks/useInfiniteList';

interface Props {
  showId: string;
  showType: Show['type'];
}

const useSimilar = ({ showId, showType = 'movie' }: Props) => useInfiniteList(similarQuery({ showId, showType }));

export default useSimilar;
