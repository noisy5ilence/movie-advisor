import { useCallback } from 'react';

import { useSetSession } from '@/hooks/useSession';

const useLogOut = () => {
  const setSession = useSetSession();

  return useCallback(() => setSession(null), [setSession]);
};

export default useLogOut;
