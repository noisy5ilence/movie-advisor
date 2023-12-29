'use client';

import { useState } from 'react';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { ArrowLeft, ArrowRight, SlidersHorizontal } from 'lucide-react';

import Movie from '@/components/Movie/Preview';
import { Button } from '@/components/ui/button';

import Filter from './components/Filter';
import useRandomMovie from './useRandomMovie';

const isShowFilterAtom = atomWithStorage('is-show-filters', false);

export default function Container() {
  const [isShowFilter, setIsShowFilter] = useAtom(isShowFilterAtom);
  const { movie, next, previous, hasPrevious } = useRandomMovie();
  const [direction, setDirection] = useState(0);

  return (
    <>
      {isShowFilter && <Filter />}
      <div className='gap-2 flex bg-background mb-2 lg:static max-sm:z-10 max-sm:fixed max-sm:bottom-0 max-sm:left-0 max-sm:w-full max-sm:p-2 max-sm:px-[12px] max-sm:mb-0'>
        <Button
          className='p-2'
          onClick={() => {
            previous();
            setDirection(-1);
          }}
          disabled={!hasPrevious}
          title='Previous movie'
        >
          <ArrowLeft size={24} strokeWidth={1} />
        </Button>
        <Button
          className='p-2'
          onClick={() => setIsShowFilter((isShow) => !isShow)}
          title={isShowFilter ? 'Hide filters' : 'Show filters'}
          variant={isShowFilter ? 'outline' : 'default'}
        >
          <SlidersHorizontal size={24} strokeWidth={1} />
        </Button>
        <Button
          className='w-full p-2 grow'
          variant='default'
          onClick={() => {
            next();
            setDirection(1);
          }}
          title='Next movie'
        >
          <ArrowRight size={24} strokeWidth={1} />
        </Button>
      </div>
      <Movie movie={movie} direction={direction} />
      <div className='w-full h-2 max-sm:h-20' />
    </>
  );
}
