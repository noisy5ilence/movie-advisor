import { FC } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import Credits from '@/components/Movie/components/Credits';
import ToggleTrailer from '@/components/Movie/components/Trailer';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import Card from '../Card';

import Actions from './components/Actions';

interface Props {
  movie?: Movie;
  className?: string;
  direction?: number;
  onClose?: () => void;
}

const variants = {
  enter: (direction: number) => ({
    scale: 0.8,
    opacity: 0,
    [direction === 0 ? 'y' : 'x']: direction === 0 ? -100 : direction * 300
  }),
  center: { x: 0, opacity: 1, y: 0, scale: 1 },
  exit: (direction: number) => ({ scale: 0.8, opacity: 1, x: direction * -300 })
};

const Preview: FC<Props> = ({ movie, className, direction, onClose }) => {
  if (!movie) return null;

  return (
    <div className={cn('rounded-xl bg-card text-card-foreground', { 'p-2': Boolean(onClose) }, className)}>
      <div className='flex flex-col lg:flex-row max-w-[100%] gap-3'>
        <div className='max-w-[300px] min-w-[300px] h-[450px] mx-auto w-[100%] relative overflow-hidden rounded-lg'>
          <AnimatePresence custom={direction}>
            <motion.div
              className='absolute'
              initial='enter'
              animate='center'
              exit='exit'
              key={movie?.id}
              variants={variants}
              custom={direction}
              transition={{ type: 'tween' }}
            >
              <Card movie={movie} className='max-w-[300px] min-w-[300px] mx-auto w-full'>
                <ToggleTrailer movieId={movie?.id} />
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className='flex flex-col grow'>
          <div className='flex w-full gap-2'>
            <Actions movie={movie} />
          </div>
          <Separator className='my-2' />
          <motion.p
            key={movie.id}
            className='leading-7'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {movie.overview}
          </motion.p>
        </div>
      </div>
      <Credits movieId={movie.id} onPersonClick={onClose} />
    </div>
  );
};

export default Preview;
