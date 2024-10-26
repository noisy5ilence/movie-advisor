import { useQuery } from '@tanstack/react-query';

import detailsQuery from '@/api/queries/details';

interface Props {
  showId?: Show['id'];
  showType?: Show['type'];
}

const useDetails = ({ showId, showType = 'movie' }: Props) => useQuery(detailsQuery({ showId, showType }));

export default useDetails;
