'use client';

import { FC } from 'react';

import Preview from '@/components/Preview';
import Trending from '@/components/Trending';
import { Skeleton } from '@/components/ui/skeleton';

import Carousel from './components/Carousel';
import useRandomMovie from './useRandomMovie';

interface Props {
  page: number;
  type: Show['type'];
}

const Container: FC<Props> = ({ page, type }) => {
  const { show, shows, onIndexChange, fetchNextPage } = useRandomMovie({ page, type });

  return (
    <div className='flex flex-1 flex-col'>
      <div className='xs:mb-4'>
        {show ? (
          <Preview
            show={show}
            className='rounded-md bg-background'
            poster={<Carousel key={type} shows={shows} onIndexChange={onIndexChange} onEndReached={fetchNextPage} />}
          />
        ) : (
          <Skeleton className='card-aspect-ratio static-aspect-ratio mx-auto rounded-lg' />
        )}
        <div className='h-2 w-full' />
      </div>
      <div className='hidden w-full rounded-lg xs:block'>
        <Trending showId={show?.id} showType={show?.type} />
        <div className='h-2 w-full' />
      </div>
    </div>
  );
};

export default Container;
