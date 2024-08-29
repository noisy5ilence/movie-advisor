import { atom, useAtomValue, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

const favoritesAtom = atomWithStorage<Array<MovieDBResponse>>('favorite', [
  { page: 1, results: [], total_pages: 1, total_results: 0 }
]);
const favoritesMapAtom = atom((get) => {
  const map = new Map();
  const favorites = get(favoritesAtom);

  favorites[0].results.forEach((movie) => map.set(movie.id, movie));

  return map as Map<number, Movie>;
});
const useFavorites = () => {
  return {
    pages: useAtomValue(favoritesAtom),
    map: useAtomValue(favoritesMapAtom)
  };
};

export const useFavoritesMutation = () => {
  const setFavorites = useSetAtom(favoritesAtom);
  const add = (movie: Movie) => {
    setFavorites((favorites) => {
      favorites[0].results = [movie, ...favorites[0].results];
      favorites[0].total_results = favorites[0].results.length;
      return [...favorites];
    });
  };

  const remove = (movieId: number) => {
    setFavorites((favorites) => {
      favorites[0].results = favorites[0].results.filter((movie) => movie.id !== movieId);
      favorites[0].total_results = favorites[0].results.length;
      return [...favorites];
    });
  };

  return {
    add,
    remove
  };
};

export const useFavoriteToggle = (movie: Movie) => {
  const { add, remove } = useFavoritesMutation();
  const { map } = useFavorites();

  const isFavorite = map.has(movie.id);

  const toggle = () => (isFavorite ? remove(movie.id) : add(movie));

  return { isFavorite, toggle };
};

export default useFavorites;
