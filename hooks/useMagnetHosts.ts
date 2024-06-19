import { useCallback } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import showHostManagerModal from '@/components/Movie/components/Torrents/HostManager';

const hostAtom = atomWithStorage<string>('magnet-host', '', undefined, {
  unstable_getOnInit: true
});

export const useHost = () => useAtomValue(hostAtom);

export const useSetHost = () => useSetAtom(hostAtom);

export const useCastMagnet = () => {
  const hosts = useHost();

  return useCallback(
    (magnet: string) => {
      const open = (hosts: string) =>
        hosts.split(',').forEach((host) => {
          const link = window.open(`http://${host}:65220/playuri?uri=${magnet}`, '_blank');
          setTimeout(() => link?.close(), 1000);
        });

      if (!hosts) return showHostManagerModal().then(open);

      return Promise.resolve(open(hosts));
    },
    [hosts]
  );
};
