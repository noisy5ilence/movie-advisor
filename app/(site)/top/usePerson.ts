import { useQuery } from '@tanstack/react-query';

import API from './api';

const usePerson = ({ id }: { id: string | null }) => {
  return useQuery({ enabled: Boolean(id), queryKey: ['person', id], queryFn: () => API.person({ id: id! }) });
};

export default usePerson;
