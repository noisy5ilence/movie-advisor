'use client';

import Preview from '@/components/Movie/Preview';

import Carousel from './components/Carousel';
import useRandomMovie from './useRandomMovie';
import Trending from './components/Trending';

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

      <div className='xs:flex hidden flex-1 w-full h-full overflow-auto snap-mandatory snap-y relative rounded-lg no-scrollbar'>
        <div className='absolute left-0 top-0 w-full'>
          <div className='snap-center'>
            <Trending label='Trending' type='trending' />
          </div>
          <div className='mt-6 snap-center'>
            <Trending label='Streaming' type='streaming' />
          </div>
          <div className='mt-6 mb-6 snap-center'>
            <Trending label='In theaters' type='theater' />
          </div>
        </div>
      </div>
    </div>
  );
}
