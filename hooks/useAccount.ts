import { useQuery, useQueryClient } from '@tanstack/react-query';

import accountQuery from '@/data/queries/account';
import { useSession } from '@/hooks/useSession';

const useAccount = () => {
  const queryClient = useQueryClient();
  const session = useSession();

  const options = accountQuery({ session });

  const query = useQuery(options);

  if (session === null) {
    queryClient.removeQueries({ queryKey: options.queryKey });
    queryClient.resetQueries({ queryKey: options.queryKey });
  }

  return session ? query.data : undefined;
};

export default useAccount;
