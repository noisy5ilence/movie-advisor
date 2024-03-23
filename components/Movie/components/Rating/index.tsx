import { FC } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star } from 'lucide-react';

interface Props {
  isFavorite: boolean;
  toggleFavorite: () => void;
  iconsFillColor?: string;
  rating?: number;
}

const Rating: FC<Props> = ({ isFavorite, rating, toggleFavorite, iconsFillColor = 'fill-accent-foreground' }) => {
  return (
    <span className='select-none flex w-full items-center ml-auto gap-1 mt-[-8px] justify-between'>
      <motion.span
        onTap={(event) => {
          event.stopPropagation();

          toggleFavorite();
        }}
        className='z-[2] cursor-pointer'
        title={isFavorite ? 'Remove from favorites' : 'Add to favorite'}
      >
        <Heart className={isFavorite ? iconsFillColor : ''} size={20} />
      </motion.span>
      <span className='flex items-center'>
        <Star size={18} className={`mr-1 ${iconsFillColor}`} />
        <span className='font-semibold'>{rating?.toFixed(1)}</span>
      </span>
    </span>
  );
};

export default Rating;
