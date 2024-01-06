import { useQuery } from '@tanstack/react-query';

import { trailers } from '@/lib/api';

const useTrailer = ({ movieId }: { movieId?: number }) => {
  return useQuery({
    enabled: Boolean(movieId),
    queryKey: ['trailers', movieId],
    queryFn: () => trailers({ movieId: movieId! }),
    select(trailers) {
      const trailer = trailers[0];
      return trailer?.site === 'YouTube' ? trailer : null;
    }
  });
};

export default useTrailer;
