import { useAtomValue, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { STREAM_URL } from '@/env';

const M3UUrlAtom = atomWithStorage<string>('M3U url', '', undefined, {
  unstable_getOnInit: true
});

export const useSetM3UUrl = () => useSetAtom(M3UUrlAtom);

export const useM3UUrl = () => useAtomValue(M3UUrlAtom);
