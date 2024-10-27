import { useCallback } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import showHostManagerModal from '@/components/Preview/components/Torrents/components/HostManager';

const magnetPrefixAtom = atomWithStorage<string>('magnet-prefix', 'http://{host}:9090/magnet?magnet=', undefined, {
  unstable_getOnInit: true
});

export const usePrefix = () => useAtomValue(magnetPrefixAtom);

export const useSetPrefix = () => useSetAtom(magnetPrefixAtom);

export const useCastMagnet = () => {
  const prefix = usePrefix();

  return useCallback(
    (magnet: string) => {
      const open = (prefix: string) => {
        const link = window.open(`${prefix}${magnet}`, '_blank');
        setTimeout(() => link?.close(), 1000);
      };

      if (!prefix || prefix.includes('{host}')) return showHostManagerModal().then(open);

      return Promise.resolve(open(prefix));
    },
    [prefix]
  );
};
