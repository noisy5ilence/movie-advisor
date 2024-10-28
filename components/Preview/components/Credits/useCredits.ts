import { useQuery } from '@tanstack/react-query';

import creditsQuery, { CreditsQueryProps } from '@/data/queries/credits';

const useCredits = ({ showId, showType }: CreditsQueryProps) => {
  return useQuery(creditsQuery({ showId, showType }));
};

export default useCredits;
