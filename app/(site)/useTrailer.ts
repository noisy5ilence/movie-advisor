import { useQuery } from '@tanstack/react-query';

import { trailers } from '@/lib/api';

const useTrailer = ({ movieId, type = 'movie' }: { movieId?: number; type?: ShowType }) => {
  return useQuery({
    enabled: Boolean(movieId),
    queryKey: ['trailers', movieId, type],
    queryFn: () => trailers({ movieId: movieId!, type }),
    select(trailers) {
      const trailer = trailers[0];
      return trailer?.site === 'YouTube' ? trailer : null;
    }
  });
};

export default useTrailer;
