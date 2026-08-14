import { useCallback } from 'react';

import { useSetSession } from '@/hooks/useSession';
import analytics, { clearIdentity } from '@/lib/analytics';

const useLogOut = () => {
  const setSession = useSetSession();

  return useCallback(() => {
    analytics.authSignedOut();
    clearIdentity();
    setSession(undefined);
  }, [setSession]);
};

export default useLogOut;
