'use client';

import similarQuery from '@/data/queries/similar';
import useInfiniteList from '@/hooks/useInfiniteList';

interface Props {
  showId: Show['id'];
  showType: Show['type'];
  type?: 'similar' | 'recommendations';
  enabled: boolean;
}

const useSimilar = ({ showId, showType = 'movie', type = 'similar', enabled }: Props) =>
  useInfiniteList({ ...similarQuery({ showId, showType, type }), mode: 'default', list: type, enabled });

export default useSimilar;
