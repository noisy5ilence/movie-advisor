import { useQuery } from '@tanstack/react-query';

import { details } from '@/api';

interface Props {
  showId?: Show['id'];
  showType?: Show['type'];
}

export const KEY = ({ showId, showType = 'movie' }: Props) => ['details', showId, showType];

const useDetails = ({ showId, showType = 'movie' }: Props) =>
  useQuery({
    enabled: Boolean(showId && showType),
    queryKey: KEY({ showId, showType }),
    queryFn: () => details({ showId: showId!, showType })
  });

export default useDetails;
