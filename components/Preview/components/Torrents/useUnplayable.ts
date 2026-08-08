import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

const unplayableAtom = atomWithStorage<Record<string, string>>('unplayable-torrents', {}, undefined, {
  unstable_getOnInit: true
});

const normalize = (hash?: string) => hash?.toLowerCase();

const useUnplayable = () => {
  const [unplayable, setUnplayable] = useAtom(unplayableAtom);

  const reasonFor = (hash?: string) => {
    const key = normalize(hash);

    return key ? unplayable[key] : undefined;
  };

  const markUnplayable = (hash?: string, reason?: string) => {
    const key = normalize(hash);

    if (!key || !reason) return;

    setUnplayable((current) => (current[key] === reason ? current : { ...current, [key]: reason }));
  };

  return { reasonFor, markUnplayable };
};

export default useUnplayable;
