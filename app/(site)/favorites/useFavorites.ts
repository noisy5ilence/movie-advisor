import { atom, useAtomValue, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

const favoritesAtom = atomWithStorage<Show[]>('favorite', [], undefined, {
  unstable_getOnInit: true
});
const favoritesMapAtom = atom((get) => {
  const map = new Map();
  const favorites = get(favoritesAtom);

  favorites.forEach((show) => map.set(show.id, show));

  return map as Map<Show['id'], Show>;
});

const useFavorites = () => {
  return {
    shows: useAtomValue(favoritesAtom),
    map: useAtomValue(favoritesMapAtom)
  };
};

export const useFavoritesMutation = () => {
  const setFavorites = useSetAtom(favoritesAtom);

  const add = (show: Show) => setFavorites((favorites) => [show, ...favorites]);
  const remove = (showId: number) => setFavorites((favorites) => favorites.filter(({ id }) => id !== showId));

  return {
    add,
    remove
  };
};

export const useFavoriteToggle = (show: Show) => {
  const { add, remove } = useFavoritesMutation();
  const { map } = useFavorites();

  const isFavorite = map.has(show.id);

  const toggle = () => (isFavorite ? remove(show.id) : add(show));

  return { isFavorite, toggle };
};

export default useFavorites;
