import { useQuery } from '@tanstack/react-query';

import { popularByType, trendingMovies } from '@/api';

const useTrending = ({ type, enabled }: { enabled?: boolean; type: 'trending' | 'streaming' | 'theater' | 'rent' }) => {
  return useQuery({
    enabled,
    queryKey: ['trending', type],
    queryFn: () => (type === 'trending' ? trendingMovies() : popularByType({ type }))
  });
};

export default useTrending;
