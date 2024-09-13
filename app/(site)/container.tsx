'use client';

import Preview from '@/components/Movie/Preview';

import Carousel from './components/Carousel';
import Trending from './components/Trending';
import useRandomMovie from './useRandomMovie';

const Random = () => {
  const { movies, movie, index, onIndexChange, fetchNextPage } = useRandomMovie();

  return (
    <Preview
      movie={movie}
      className='bg-background rounded-md'
      card={<Carousel index={index} movies={movies} onIndexChange={onIndexChange} onEndReached={fetchNextPage} />}
    />
  );
};

export default function Container() {
  return (
    <div className='flex flex-col flex-1'>
      <div className='xs:mb-4'>
        <Random />
        <div className='w-full h-2' />
      </div>

      <div className='xs:block hidden w-full rounded-lg'>
        <Trending />
        <div className='w-full h-2' />
      </div>
    </div>
  );
}
