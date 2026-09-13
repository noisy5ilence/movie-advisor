import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

const launchedAtom = atomWithStorage<string[]>('launched-torrents', [], undefined, {
  unstable_getOnInit: true
});

const useLaunchedTorrents = () => {
  const [launched, setLaunched] = useAtom(launchedAtom);

  const isLaunched = (key?: string) => Boolean(key) && launched.includes(key!);

  const launch = (key?: string) =>
    void setLaunched((current) => (!key || current.includes(key) ? current : [...current, key]));

  return { isLaunched, launch };
};

export default useLaunchedTorrents;
