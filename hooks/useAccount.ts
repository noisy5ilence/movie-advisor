import { account } from '@/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from './useSession';

const KEY = ['account'];

const useAccount = () => {
  const queryClient = useQueryClient();
  const session = useSession();

  const query = useQuery({
    enabled: Boolean(session),
    staleTime: Infinity,
    notifyOnChangeProps: ['data'],
    queryKey: KEY,
    queryFn: () => account()
  });

  if (session === null) {
    queryClient.removeQueries({ queryKey: KEY });
    queryClient.resetQueries({ queryKey: KEY });
  }

  return session ? query.data : undefined;
};

export default useAccount;
