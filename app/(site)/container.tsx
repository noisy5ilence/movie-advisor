'use client';

import Preview from '@/components/Movie/Preview';

import { Carousel, Measurer } from './components/Carousel';
import useRandomMovie from './useRandomMovie';

export default function Container() {
  const { movies, movie, index, onIndexChange } = useRandomMovie();

  return (
    <Measurer>
      {(width) => (
        <>
          <Preview
            movie={movie}
            className='bg-background rounded-md'
            card={<Carousel index={index} width={width} movies={movies} onIndexChange={onIndexChange} />}
          />
          <div className='w-full h-2' />
        </>
      )}
    </Measurer>
  );
}
