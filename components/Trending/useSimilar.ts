'use client';

import { useQuery } from '@tanstack/react-query';

import similarQuery from '@/data/queries/similar';

interface Props {
  showId: Show['id'];
  showType: Show['type'];
  type?: 'similar' | 'recommendations';
  enabled: boolean;
}

const useSimilar = ({ showId, showType = 'movie', type = 'similar', enabled }: Props) =>
  useQuery({ ...similarQuery({ showId, showType, type }), enabled });

export default useSimilar;
