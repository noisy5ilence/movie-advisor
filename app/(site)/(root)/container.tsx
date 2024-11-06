'use client';

import { FC } from 'react';

import Preview from '@/components/Preview';
import Trending from '@/components/Trending';

import Carousel from './(components)/Carousel';
import useRandomMovie from './useRandomMovie';

interface Props {
  page: number;
}

const Container: FC<Props> = ({ page }) => {
  const { movie, movies, onIndexChange, fetchNextPage } = useRandomMovie({ page });

  return (
    <div className='flex flex-1 flex-col'>
      <div className='xs:mb-4'>
        <Preview
          show={movie}
          className='rounded-md bg-background'
          poster={<Carousel shows={movies} onIndexChange={onIndexChange} onEndReached={fetchNextPage} />}
        />
        <div className='h-2 w-full' />
      </div>
      <div className='hidden w-full rounded-lg xs:block'>
        <Trending showId={movie.id} showType={movie.type} />
        <div className='h-2 w-full' />
      </div>
    </div>
  );
};

export default Container;
