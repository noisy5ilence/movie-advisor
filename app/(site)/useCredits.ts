import { useQuery } from '@tanstack/react-query';

import API from './api';

const useCredits = ({ movieId }: { movieId?: Movie['id'] }) => {
  return useQuery({
    queryKey: ['credits', movieId],
    queryFn: () => API.credits({ movieId: movieId! }),
    enabled: Boolean(movieId)
  });
};

export default useCredits;
