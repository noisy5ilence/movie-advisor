import { useAtomValue, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { STREAM_URL } from '@/env';

const streamUrlAtom = atomWithStorage<string>('stream url', STREAM_URL, undefined, {
  unstable_getOnInit: true
});

export const useSetStreamUrl = () => useSetAtom(streamUrlAtom);

export const useStreamUrl = () => useAtomValue(streamUrlAtom) || STREAM_URL;
