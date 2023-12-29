import { FC } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star } from 'lucide-react';

import useFavorites, { useFavoritesMutation } from '@/app/(site)/favorites/useFavorites';

interface Props {
  movie: Movie;
  iconsFillColor?: string;
}

const Rating: FC<Props> = ({ movie, iconsFillColor = 'fill-accent-foreground' }) => {
  const { map } = useFavorites();
  const { add, remove } = useFavoritesMutation();

  const isFavorite = map.has(movie.id);

  return (
    <span className='select-none flex w-full items-center ml-auto gap-1 mt-[-8px] justify-between'>
      <motion.span
        onTap={(event) => {
          event.stopPropagation();

          isFavorite ? remove(movie.id) : add(movie);
        }}
        className='z-[2] cursor-pointer'
        title={isFavorite ? 'Remove from favorites' : 'Add to favorite'}
      >
        <Heart className={isFavorite ? iconsFillColor : ''} size={20} />
      </motion.span>
      <span className='flex items-center'>
        <Star size={18} className={`mr-1 ${iconsFillColor}`} />
        <span className='font-semibold'>{movie.vote_average?.toFixed(1)}</span>
      </span>
    </span>
  );
};

export default Rating;
