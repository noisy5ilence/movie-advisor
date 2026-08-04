import { useQuery } from '@tanstack/react-query';

import personQuery, { PersonQueryProps } from '@/data/queries/person';

const useProfile = ({ personId }: PersonQueryProps) => useQuery(personQuery({ personId }));

export default useProfile;
