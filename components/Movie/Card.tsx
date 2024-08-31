import { FC } from 'react';

import Poster from '@/components/Movie/components/Poster';
import Rating from '@/components/Movie/components/Rating';
import { cn } from '@/lib/utils';

import Favorite from './components/Favorite';
import Handlers from './components/Handlers';

interface Props {
  movie?: Movie;
  onClick?: () => void;
  className?: string;
  containerProps?: unknown;
}

const Card: FC<Props> = ({ movie, onClick, className, containerProps }) => {
  if (!movie) return null;

  return (
    <div
      {...(containerProps || {})}
      className={cn(
        'card-aspect-ratio relative bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-lg overflow-hidden rounded-lg',
        className
      )}
    >
      <div className='flex w-full h-full'>
        <Poster title={movie.name || movie.title} poster={movie.poster_path} />
      </div>
      <div className='text-white absolute w-full h-full top-0 left-0 rounded-md flex flex-col justify-between p-2 card-gradient'>
        <Handlers movie={movie} onClick={onClick} />
        <div className='grid grid-cols-[1fr_auto] text-lg opacity-75 gap-2'>
          <span className='overflow-ellipsis overflow-hidden whitespace-nowrap'>{movie.name || movie.title}</span>
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
  );
};

export default Card;
