import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import useAccount from '@/hooks/useAccount';

type SourceState = Record<string, Record<string, number>>;

const sourceStateAtom = atomWithStorage<SourceState>('current-video-source', {}, undefined, {
  unstable_getOnInit: true
});

const useSource = ({ magnet }: { magnet: string }) => {
  const [source, setSource] = useAtom(sourceStateAtom);
  const account = useAccount();

  const user = account?.username ?? 'local';

  const setIndex = useCallback(
    (update: number | ((index: number) => number)) => {
      setSource((state) => ({
        ...state,
        [user]: {
          ...(state[user] || {}),
          [magnet]: typeof update === 'function' ? update(state[user]?.[magnet] ?? 0) : update
        }
      }));
    },
    [setSource, user, magnet]
  );

  const index = source[user]?.[magnet] || 0;

  return { index, setIndex };
};

export default useSource;
