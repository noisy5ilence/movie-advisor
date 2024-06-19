import { FC } from 'react';
import { motion } from 'framer-motion';

import useFavorites, { useFavoritesMutation } from '@/app/(site)/favorites/useFavorites';
import Poster from '@/components/Movie/components/Poster';
import Rating from '@/components/Movie/components/Rating';
import Title from '@/components/Movie/components/Title';
import { cn } from '@/lib/utils';

interface Props {
  movie?: Movie;
  onClick?: () => void;
  fit?: boolean;
}

const Card: FC<Props> = ({ movie, onClick, fit }) => {
  const { add, remove } = useFavoritesMutation();
  const { map } = useFavorites();

  if (!movie) return null;

  const isFavorite = map.has(movie.id);

  const handleToggleFavorite = () => (isFavorite ? remove(movie.id) : add(movie));

  return (
    <div
      onDoubleClick={handleToggleFavorite}
      className={cn(
        'w-[300px] h-[450px] shrink-0 mx-auto relative',
        fit ? 'xs:w-[300px] xs:h-[450px] w-full h-full aspect-w-2 aspect-h-3' : undefined
      )}
    >
      <motion.div className='absolute top-0 left-0 flex flex-col w-full h-full mx-auto bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-lg overflow-hidden rounded-lg'>
        <motion.div onTap={onClick} className='flex w-full h-full'>
          <Poster title={movie?.name || movie.title} size={100} poster={movie.poster_path} />
        </motion.div>
        <div className='absolute left-0 top-0 w-full h-20 bg-gradient-to-t from-transparent to-black opacity-75 rounded-t-lg'>
          <div className='h-full w-full mx-auto pt-1 px-3 text-white'>
            <div className='grid items-center grid-cols-[1fr_50px]'>
              <Title key={movie?.name || movie.title} title={movie?.name || movie.title} />
              {movie.release_date && (
                <span className='flex justify-end text-lg font-semibold'>
                  {new Date(movie.release_date).getFullYear()}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className='absolute left-0 bottom-0 w-full bg-gradient-to-t from-black to-transparent h-20 text-white p-3 pb-2 flex flex-col justify-end opacity-75'>
          <Rating
            isFavorite={isFavorite}
            toggleFavorite={handleToggleFavorite}
            rating={movie.vote_average}
            iconsFillColor='fill-white'
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Card;
