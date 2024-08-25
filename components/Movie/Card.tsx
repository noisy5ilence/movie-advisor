import { FC } from 'react';

import useFavorites, { useFavoritesMutation } from '@/app/(site)/favorites/useFavorites';
import Poster from '@/components/Movie/components/Poster';
import Rating from '@/components/Movie/components/Rating';
import Title from '@/components/Movie/components/Title';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';

interface Props {
  movie?: Movie;
  onClick?: () => void;
  className?: string;
}

const Card: FC<Props> = ({ movie, onClick, className }) => {
  const { add, remove } = useFavoritesMutation();
  const { map } = useFavorites();

  if (!movie) return null;

  const isFavorite = map.has(movie.id);

  const handleToggleFavorite = () => (isFavorite ? remove(movie.id) : add(movie));

  return (
    <div className='xs:w-[300px] xs:h-[450px] w-full h-full shrink-0'>
      <AspectRatio ratio={2 / 3}>
        <div
          onClick={onClick}
          onDoubleClick={handleToggleFavorite}
          className={cn(
            'h-full relative bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-lg overflow-hidden rounded-lg',
            className
          )}
        >
          <div className='flex w-full h-full'>
            <Poster title={movie?.name || movie.title} poster={movie.poster_path} />
          </div>
          <div className='text-white absolute w-full h-full top-0 left-0 rounded-md flex flex-col justify-between p-2 card-gradient'>
            <div className='grid items-center grid-cols-[1fr_50px] mt-[-5px] opacity-75'>
              <Title key={movie?.name || movie.title} title={movie?.name || movie.title} />
              {movie.release_date && (
                <span className='flex justify-end text-lg'>{new Date(movie.release_date).getFullYear()}</span>
              )}
            </div>
            <div className='opacity-75 mb-[-5px]'>
              <Rating
                isFavorite={isFavorite}
                toggleFavorite={handleToggleFavorite}
                rating={movie.vote_average}
                iconsFillColor='fill-white'
              />
            </div>
          </div>
        </div>
      </AspectRatio>
    </div>
  );
};

export default Card;
