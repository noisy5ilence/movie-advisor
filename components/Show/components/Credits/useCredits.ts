import { useQuery } from '@tanstack/react-query';

import { credits } from '@/api';

interface Props {
  showId: Show['id'];
  showType?: Show['type'];
}

const useCredits = ({ showId, showType }: Props) => {
  return useQuery({
    queryKey: ['credits', showId, showType],
    queryFn: () => credits({ showId, showType }),
    enabled: Boolean(showId)
  });
};

export default useCredits;
