import { useQuery } from '@tanstack/react-query';

import { credits } from '@/api';

interface Props {
  showId?: Show['id'];
  showType?: Show['type'];
}

export const KEY = ({ showId, showType }: Props) => ['credits', showId, showType];

const useCredits = ({ showId, showType }: Props) => {
  return useQuery({
    queryKey: KEY({ showId, showType }),
    queryFn: () => credits({ showId, showType }),
    enabled: Boolean(showId)
  });
};

export default useCredits;
