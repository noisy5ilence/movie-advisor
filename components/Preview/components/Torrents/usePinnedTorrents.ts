import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

const magnetsAtom = atomWithStorage<Record<string, string>>('pinned-magnets', {}, undefined, {
  unstable_getOnInit: true
});

const usePinnedTorrents = () => {
  const [magnets, setMagnets] = useAtom(magnetsAtom);

  const savedMagnet = (key?: string) => (key ? magnets[key] : undefined);

  const rememberMagnet = (key?: string, magnet?: string) =>
    void setMagnets((current) =>
      !key || !magnet || current[key] === magnet ? current : { ...current, [key]: magnet }
    );

  return { savedMagnet, rememberMagnet };
};

export default usePinnedTorrents;
