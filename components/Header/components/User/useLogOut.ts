import { useCallback } from 'react';

import { useSetSession } from '@/hooks/useSession';
import { clearIdentity, track } from '@/lib/analytics';

const useLogOut = () => {
  const setSession = useSetSession();

  return useCallback(() => {
    track('auth_signed_out', {});
    clearIdentity();
    setSession(undefined);
  }, [setSession]);
};

export default useLogOut;
