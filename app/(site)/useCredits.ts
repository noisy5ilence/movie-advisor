import { useQuery } from '@tanstack/react-query';

import { credits } from '@/lib/api';

const useCredits = ({ movieId, type }: { movieId?: Movie['id']; type?: ShowType }) => {
  return useQuery({
    queryKey: ['credits', movieId, type],
    queryFn: () => credits({ movieId: movieId!, type }),
    enabled: Boolean(movieId)
  });
};

export default useCredits;
