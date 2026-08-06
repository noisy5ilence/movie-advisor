import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

const pinnedAtom = atomWithStorage<string[]>('pinned-torrents', [], undefined, {
  unstable_getOnInit: true
});

const usePinnedTorrents = () => {
  const [pinned, setPinned] = useAtom(pinnedAtom);

  const isPinned = (key?: string) => Boolean(key) && pinned.includes(key!);

  const pin = (key?: string) =>
    void setPinned((current) => (!key || current.includes(key) ? current : [...current, key]));

  const toggle = (key?: string) =>
    void setPinned((current) => {
      if (!key) return current;

      return current.includes(key) ? current.filter((item) => item !== key) : [...current, key];
    });

  return { pinned, isPinned, pin, toggle };
};

export default usePinnedTorrents;
