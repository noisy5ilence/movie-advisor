import { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';

import Poster from '@/components/Movie/components/Poster';
import Rating from '@/components/Movie/components/Rating';
import Title from '@/components/Movie/components/Title';

interface Props {
  movie?: Movie;
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
}

const Card: FC<Props> = ({ movie, className, children, onClick }) => {
  if (!movie) return null;

  return (
    <div
      className={`${className} rounded-lg relative bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-lg overflow-hidden rounded-lg`}
    >
      <motion.div className='flex justify-center grow' onTap={onClick}>
        <Poster title={movie.title} width={300} height={450} size={100} poster={movie.poster_path} />
        {children}
        <div className='absolute left-0 top-0 w-full h-20 bg-gradient-to-t from-transparent to-black opacity-80'>
          <div className='max-w-[300px] w-full mx-auto pt-1 px-3 text-white'>
            <div className='grid items-center grid-cols-[1fr_50px]'>
              <Title hideGradient title={movie.title} />
              {movie.release_date && (
                <span className='flex justify-end text-lg font-semibold'>
                  {new Date(movie.release_date).getFullYear()}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
      <div className='absolute left-0 bottom-0 w-full bg-gradient-to-t from-black to-transparent h-20 text-white p-3 pb-2 flex flex-col justify-end opacity-80'>
        <Rating movie={movie} iconsFillColor='fill-white' />
      </div>
    </div>
  );
};

export default Card;
