'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { ArrowLeft, ArrowRight, SlidersHorizontal } from 'lucide-react';

import Movie from '@/components/Movie/Preview';
import { Button } from '@/components/ui/button';
import useMounted from '@/hooks/useMounted';
import { genres } from '@/lib/api';
import getQueryClient from '@/lib/queryClient';

import Filter from './components/Filter';
import useRandomMovie from './useRandomMovie';

const isShowFilterAtom = atomWithStorage('is-show-filters', false);

export default function Container() {
  const [isShowFilter, setIsShowFilter] = useAtom(isShowFilterAtom);
  const { movie, next, previous, hasPrevious } = useRandomMovie();
  const [direction, setDirection] = useState(0);
  const isMounted = useMounted();

  useEffect(() => {
    const queryClient = getQueryClient();

    queryClient.prefetchQuery({ queryKey: ['genres'], queryFn: () => genres() });
  }, []);

  const handleChangeMovie = (direction: 1 | -1) => () => {
    direction === 1 ? next() : previous();
    setDirection(direction);
  };

  return (
    <>
      {isShowFilter && <Filter />}
      <Movie movie={movie} direction={direction}>
        <div className='gap-2 flex w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:static max-sm:z-10 max-sm:fixed max-sm:bottom-0 max-sm:left-0 max-sm:w-full max-sm:p-2 max-sm:px-2 max-sm:mb-0'>
          <Button
            className='grow h-12 sm:h-8'
            onClick={handleChangeMovie(-1)}
            disabled={!hasPrevious}
            title='Previous movie'
          >
            <ArrowLeft size={24} />
          </Button>
          {isMounted &&
            createPortal(
              <Button
                className='p-2'
                onClick={() => setIsShowFilter((isShow) => !isShow)}
                title={isShowFilter ? 'Hide filters' : 'Show filters'}
                variant='ghost'
              >
                <SlidersHorizontal size={19} />
              </Button>,
              document.getElementById('actions')!
            )}
          <Button className='grow h-12 sm:h-8' onClick={handleChangeMovie(1)} title='Next movie'>
            <ArrowRight size={24} />
          </Button>
        </div>
      </Movie>
      <div className='w-full h-2 max-sm:h-20' />
    </>
  );
}
