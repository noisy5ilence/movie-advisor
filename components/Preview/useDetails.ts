import { useQuery } from '@tanstack/react-query';

import { details } from '@/api';

const useDetails = ({ showId, showType = 'movie' }: { showId?: Show['id']; showType?: Show['type'] }) =>
  useQuery({
    enabled: Boolean(showId && showType),
    queryKey: ['details', showId, showType],
    queryFn: () => details({ showId: showId!, showType })
  });

export default useDetails;
