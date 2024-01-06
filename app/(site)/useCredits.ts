import { useQuery } from '@tanstack/react-query';

import { credits } from '@/lib/api';

const useCredits = ({ movieId }: { movieId?: Movie['id'] }) => {
  return useQuery({
    queryKey: ['credits', movieId],
    queryFn: () => credits({ movieId: movieId! }),
    enabled: Boolean(movieId)
  });
};

export default useCredits;
