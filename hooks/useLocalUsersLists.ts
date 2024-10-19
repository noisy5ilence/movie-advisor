import { Atom, atom, PrimitiveAtom, useAtomValue, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useCallback } from 'react';

type MapShow = Map<Show['id'], Show>;

const createStorage = (key: string) => {
  const listAtom = atomWithStorage<Show[]>(key, [], undefined, {
    unstable_getOnInit: true
  });

  const mapAtom = atom<MapShow>((get) => {
    const map = new Map();
    const list = get(listAtom);

    list.forEach((show) => map.set(show.id, show));

    return map;
  });

  return { listAtom, mapAtom };
};

const createUseShows =
  ({ listAtom, mapAtom }: { listAtom: PrimitiveAtom<Show[]>; mapAtom: Atom<MapShow> }) =>
  () => ({
    shows: useAtomValue(listAtom),
    map: useAtomValue(mapAtom)
  });

const createUseShowsMutation =
  ({ listAtom }: { listAtom: PrimitiveAtom<Show[]> }) =>
  () => {
    const setShows = useSetAtom(listAtom);

    const add = (show: Show) => setShows((shows) => [show, ...shows]);
    const remove = (showId: number) => setShows((shows) => shows.filter(({ id }) => id !== showId));

    return {
      add,
      remove
    };
  };

const createUseStateToggle =
  ({
    useShows,
    useShowsMutation
  }: {
    useShows: ReturnType<typeof createUseShows>;
    useShowsMutation: ReturnType<typeof createUseShowsMutation>;
  }) =>
  (show: Show) => {
    const { add, remove } = useShowsMutation();
    const { map } = useShows();

    const active = map.has(show.id);

    const toggle = useCallback(() => (active ? remove(show.id) : add(show)), [add, remove, show]);

    return { active, toggle };
  };

const createStorageHooks = (key: string) => {
  const storage = createStorage(key);
  const useShows = createUseShows(storage);
  const useShowsMutation = createUseShowsMutation(storage);
  const useStateToggle = createUseStateToggle({
    useShows,
    useShowsMutation
  });
  return { useShows, useShowsMutation, useStateToggle };
};

export const { useShows: useFavorites, useStateToggle: useFavoritesStateToggle } =
  createStorageHooks('users-favorites');
export const { useShows: useWatchList, useStateToggle: useWatchListStateToggle } =
  createStorageHooks('users-watch-list');
