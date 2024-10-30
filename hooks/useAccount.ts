import { useQuery } from '@tanstack/react-query';

import accountQuery from '@/data/queries/account';
import { useSession } from '@/hooks/useSession';

const useAccount = () => {
  const session = useSession();

  const query = useQuery(accountQuery({ session }));

  return session ? query.data : undefined;
};

export default useAccount;
