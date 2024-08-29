'use client';

import { motion, Variants } from 'framer-motion';

import Preview from '@/components/Movie/Preview';

import { Carousel, Measurer } from './components/Carousel';
import useRandomMovie from './useRandomMovie';

const container: Variants = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.1
    }
  }
};

export default function Container() {
  const { movies, movie, index, onIndexChange } = useRandomMovie();

  return (
    <Measurer>
      {(width) => (
        <motion.div variants={container} initial='hidden' animate='visible'>
          <Preview
            movie={movie}
            className='bg-background rounded-md'
            card={<Carousel index={index} width={width} movies={movies} onIndexChange={onIndexChange} />}
          />
          <div className='w-full h-2 max-sm:h-12' />
        </motion.div>
      )}
    </Measurer>
  );
}
