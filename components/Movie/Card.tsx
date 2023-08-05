import { FC } from 'react';
import { Star } from 'lucide-react';

import Poster from '@/components/Movie/components/Poster';
import Title from '@/components/Movie/components/Title';

interface Props {
  movie?: Movie;
  className?: string;
}

const Card: FC<Props> = ({ movie, className }) => {
  if (!movie) return null;

  return (
    <div
      className={`${className} p-4 rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-lg`}
    >
      <div>
        <div className='grid items-center grid-cols-[1fr_50px]'>
          <Title title={movie.title} />
          {movie.release_date && (
            <span className='flex justify-end text-lg font-semibold'>{new Date(movie.release_date).getFullYear()}</span>
          )}
        </div>
        <div className='flex w-full justify-end items-center gap-1 mt-[-8px]'>
          <Star size={17} />
          <span className='text-lg font-semibold'>{movie.vote_average}</span>
        </div>
      </div>
      <div className='flex justify-center relative mt-1 h-full'>
        <Poster title={movie.title} width={300} height={450} size={100} poster={movie.poster_path} />
      </div>
    </div>
  );
};

export default Card;
