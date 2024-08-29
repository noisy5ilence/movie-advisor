import { FC } from 'react';

import Poster from '@/components/Movie/components/Poster';
import Rating from '@/components/Movie/components/Rating';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';

import Favorite from './components/Favorite';
import Handlers from './components/Handlers';

interface Props {
  movie?: Movie;
  onClick?: () => void;
  className?: string;
}

const Card: FC<Props> = ({ movie, onClick, className }) => {
  if (!movie) return null;

  return (
    <div className='xs:w-[300px] xs:h-[450px] w-full h-full shrink-0'>
      <AspectRatio ratio={2 / 3}>
        <div
          className={cn(
            'h-full relative bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-lg overflow-hidden rounded-lg',
            className
          )}
        >
          <div className='flex w-full h-full'>
            <Poster title={movie.name || movie.title} poster={movie.poster_path} />
          </div>
          <div className='text-white absolute w-full h-full top-0 left-0 rounded-md flex flex-col justify-between p-2 card-gradient'>
            <Handlers movie={movie} onClick={onClick} />
            <div className='flex items-start justify-between text-lg opacity-75'>
              <span>{movie.name || movie.title}</span>
              {Boolean(movie.release_date) && <span>{new Date(movie.release_date).getFullYear()}</span>}
            </div>
            <div className='opacity-75 mb-[-5px]'>
              <span className='select-none flex w-full items-center ml-auto gap-1 mt-[-8px] justify-between z-[1]'>
                <Favorite movie={movie} />
                <Rating rating={movie.vote_average} />
              </span>
            </div>
          </div>
        </div>
      </AspectRatio>
    </div>
  );
};

export default Card;
