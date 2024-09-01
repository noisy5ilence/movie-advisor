'use client';

import Preview from '@/components/Movie/Preview';

import Carousel from './components/Carousel';
import useRandomMovie from './useRandomMovie';

export default function Container() {
  const { movies, movie, index, onIndexChange, fetchNextPage } = useRandomMovie();

  return (
    <>
      <Preview
        movie={movie}
        className='bg-background rounded-md'
        card={<Carousel index={index} movies={movies} onIndexChange={onIndexChange} onEndReached={fetchNextPage} />}
      />
      <div className='w-full h-2' />
    </>
  );
}
