import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

const pinnedAtom = atomWithStorage<string[]>('pinned-torrents', [], undefined, {
  unstable_getOnInit: true
});

// Toloka magnets are fetched lazily, so cache the fetched magnet of a pinned torrent
// to keep it playable right after a reload without hitting Toloka again
const magnetsAtom = atomWithStorage<Record<string, string>>('pinned-magnets', {}, undefined, {
  unstable_getOnInit: true
});

const usePinnedTorrents = () => {
  const [pinned, setPinned] = useAtom(pinnedAtom);
  const [magnets, setMagnets] = useAtom(magnetsAtom);

  const isPinned = (key?: string) => Boolean(key) && pinned.includes(key!);

  const savedMagnet = (key?: string) => (key ? magnets[key] : undefined);

  const forgetMagnet = (key: string) => void setMagnets(({ [key]: _removed, ...rest }) => rest);

  const rememberMagnet = (key?: string, magnet?: string) =>
    void setMagnets((current) =>
      !key || !magnet || current[key] === magnet ? current : { ...current, [key]: magnet }
    );

  const pin = (key?: string) =>
    void setPinned((current) => (!key || current.includes(key) ? current : [...current, key]));

  const toggle = (key?: string) => {
    if (!key) return;

    if (pinned.includes(key)) forgetMagnet(key);

    setPinned((current) => (current.includes(key) ? current.filter((item) => item !== key) : [...current, key]));
  };

  return { pinned, isPinned, pin, toggle, savedMagnet, rememberMagnet };
};

export default usePinnedTorrents;
