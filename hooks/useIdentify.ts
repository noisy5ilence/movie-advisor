import { useEffect, useRef } from 'react';

import { identify } from '@/lib/analytics';

import useAccount from './useAccount';

const useIdentify = () => {
  const account = useAccount();
  const sentRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!account) {
      sentRef.current = undefined;
      return;
    }

    const profileId = `tmdb:${account.username || account.id}`;

    if (sentRef.current === profileId) return;

    sentRef.current = profileId;

    identify({
      profileId,
      username: account.username,
      name: account.name
    });
  }, [account]);
};

export default useIdentify;
