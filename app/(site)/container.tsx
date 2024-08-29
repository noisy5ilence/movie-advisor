'use client';

import Preview from '@/components/Movie/Preview';

import { Carousel, Measurer } from './components/Carousel';
import Filter from './components/Filter';
import useRandomMovie from './useRandomMovie';

export default function Container() {
  const { movies, movie, onIndexChange } = useRandomMovie();

  return (
    <>
      <Filter />
      <Measurer>
        {(width) => (
          <Preview
            movie={movie}
            className='bg-background rounded-md'
            card={<Carousel width={width} movies={movies} onIndexChange={onIndexChange} />}
          />
        )}
      </Measurer>
      <div className='w-full h-2 max-sm:h-12' />
    </>
  );
}
