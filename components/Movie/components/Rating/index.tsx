import { FC } from 'react';
import { Heart, Star } from 'lucide-react';

import useFavorites, { useFavoritesMutation } from '@/app/(site)/favorites/useFavorites';

interface Props {
  movie: Movie;
}

const Rating: FC<Props> = ({ movie }) => {
  const { map } = useFavorites();
  const { add, remove } = useFavoritesMutation();

  const isFavorite = map.has(movie.id);

  return (
    <span className='select-none flex w-full items-center ml-auto gap-1 mt-[-8px] justify-between'>
      <span
        onClick={(event) => {
          event.stopPropagation();

          isFavorite ? remove(movie.id) : add(movie);
        }}
        className='z-[2] cursor-pointer'
        title={isFavorite ? 'Remove from favorites' : 'Add to favorite'}
      >
        <Heart className={isFavorite ? 'fill-accent-foreground' : ''} size={18} />
      </span>
      <span className='flex items-center'>
        <Star size={18} className='fill-accent-foreground mr-1' />
        <span className='font-semibold'>{movie.vote_average?.toFixed(1)}</span>
      </span>
    </span>
  );
};

export default Rating;
