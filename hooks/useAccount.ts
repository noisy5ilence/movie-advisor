import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useSession } from '@/hooks/useSession';
import accountQuery from '@/api/queries/account';

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
