import { useQuery } from '@tanstack/react-query';

import { trailers } from '@/api';

interface Props {
  showId: Show['id'];
  showType: Show['type'];
}

const useTrailer = ({ showId, showType = 'movie' }: Props) =>
  useQuery({
    enabled: Boolean(showId),
    queryKey: ['trailers', showId, showType],
    queryFn: () => trailers({ showId, showType }),
    select(trailers) {
      const trailer = trailers[0];
      return trailer?.site === 'YouTube' ? trailer : null;
    }
  });

export default useTrailer;
