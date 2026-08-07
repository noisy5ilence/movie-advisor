import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Some releases use a video codec/container the TorrServer transcoder can't handle
// (e.g. VC-1 remuxes, AVI). Those fail with a 502 only when you actually press Play, so
// remember them by infohash to grey out Play instead of hitting the same dead-end again.
const unplayableAtom = atomWithStorage<Record<string, string>>('unplayable-torrents', {}, undefined, {
  unstable_getOnInit: true
});

// getMagnetHash uppercases, the /gst URL hash is lowercase — normalise so both sides match
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
