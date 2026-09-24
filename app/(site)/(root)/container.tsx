'use client';

import { FC, useRef } from 'react';
import { useAtom } from 'jotai';

import Preview from '@/components/Preview';
import { showTypeAtom } from '@/components/ShowTypeToggle';
import Trending from '@/components/Trending';
import { Skeleton } from '@/components/ui/skeleton';
import { generatePage } from '@/data/queries/random';

import Carousel from './components/Carousel';
import useRandomMovie from './useRandomMovie';

interface Props {
  page: number;
  type: Show['type'];
}

const Container: FC<Props> = ({ page, type }) => {
  const [showType] = useAtom(showTypeAtom);
  const pagesRef = useRef<Record<Show['type'], number>>();

  if (!pagesRef.current) {
    pagesRef.current = {
      movie: type === 'movie' ? page : generatePage('movie'),
      tv: type === 'tv' ? page : generatePage('tv')
    };
  }

  const { show, shows, onIndexChange, fetchNextPage, isLoading } = useRandomMovie({
    page: pagesRef.current[showType],
    type: showType
  });

  return (
    <div className='flex flex-1 flex-col'>
      <div className='xs:mb-4'>
        {show ? (
          <Preview
            show={show}
            className='rounded-md bg-background'
            poster={
              <Carousel key={showType} shows={shows} onIndexChange={onIndexChange} onEndReached={fetchNextPage} />
            }
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
