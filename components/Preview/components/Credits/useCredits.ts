import { useQuery } from '@tanstack/react-query';

import creditsQuery, { CreditsQueryProps } from '@/api/queries/credits';

const useCredits = ({ showId, showType }: CreditsQueryProps) => {
  return useQuery(creditsQuery({ showId, showType }));
};

export default useCredits;
