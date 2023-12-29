import { FC } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useRouter } from 'next/navigation';

import useTrailer from '@/app/(site)/useTrailer';
import Credits from '@/components/Movie/components/Credits';
import { showTrailerModal } from '@/components/Movie/components/Trailer';
import { Separator } from '@/components/ui/separator';

import { Button } from '../ui/button';

import { showTorrentsModal } from './components/Torrents';
import Card from './Card';

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
    [direction === 0 ? 'y' : 'x']: direction === 0 ? -100 : direction * -320
  }),
  center: { x: 0, opacity: 1, y: 0, scale: 1 },
  exit: (direction: number) => ({ scale: 0.8, opacity: 1, x: direction * 320 })
};

const Preview: FC<Props> = ({ movie, className, onClose, direction }) => {
  const { data: trailer } = useTrailer({ movieId: movie?.id });
  const router = useRouter();

  if (!movie) return null;

  return (
    <div className={`rounded-xl bg-card text-card-foreground ${className} ${onClose ? 'p-2' : ''}`}>
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
                {trailer && (
                  <motion.div
                    onTap={() => showTrailerModal({ trailerKey: trailer?.key })}
                    title='Play trailer'
                    className='absolute w-full h-full left-0 top-0 bg-black cursor-pointer overflow-hidden rounded-lg transition-opacity opacity-0 hover:opacity-70 flex items-center justify-center'
                  >
                    <Play size={100} className='fill-white' />
                  </motion.div>
                )}
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className='flex flex-col grow'>
          <div className='flex w-full gap-2'>
            <Button className='h-8 grow' onClick={() => showTorrentsModal({ title: movie.title })}>
              Torrents
            </Button>
            <Button
              className='h-8 grow'
              onClick={() => {
                router.push(`/top?similar=${movie.id}&title=${encodeURIComponent(movie.title)}`);
                onClose?.();
              }}
            >
              Similar
            </Button>
          </div>
          <Separator className='my-2' />
          <motion.p
            key={movie.id}
            className='leading-7'
            initial={{ opacity: 0, y: -100 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
          >
            {movie.overview}
          </motion.p>
        </div>
      </div>
      <Credits movieId={movie.id} onPersonClick={() => onClose?.()} />
    </div>
  );
};

export default Preview;
