import { useCallback } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import showHostManagerModal from '@/components/Preview/components/Torrents/components/HostManager';

import { STREAM_URL } from '../constants';

const magnetPrefixAtom = atomWithStorage<string>('magnet-prefix', 'http://{host}:9090/magnet?magnet=', undefined, {
  unstable_getOnInit: true
});

export const usePrefix = () => useAtomValue(magnetPrefixAtom);

export const useSetPrefix = () => useSetAtom(magnetPrefixAtom);

export const useCastMagnet = () => {
  const prefix = usePrefix();

  return useCallback(
    async (link: string) => {
      let magnet = link;

      if (link && !link.startsWith('magnet')) {
        magnet = await fetch(`${STREAM_URL}${encodeURIComponent(link)}&stat=true`)
          .then((response) => response.json())
          .then((torrent: Stream) => `magnet:?xt=urn:btih:${torrent.hash}&dn=${encodeURIComponent(torrent.name)}`);
      }

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
