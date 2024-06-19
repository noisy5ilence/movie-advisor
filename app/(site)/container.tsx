'use client';

import { useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { ArrowLeft, ArrowRight, SlidersHorizontal } from 'lucide-react';
import { EffectCoverflow, Virtual } from 'swiper/modules';
import { Swiper, SwiperProps, SwiperSlide } from 'swiper/react';

import Card from '@/components/Movie/Card';
import Movie from '@/components/Movie/Preview';
import { Button } from '@/components/ui/button';
import useMounted from '@/hooks/useMounted';
import useUrlToMagnet from '@/hooks/useUrlToMagnet';
import { genres } from '@/lib/api';
import getQueryClient from '@/lib/queryClient';

import Filter from './components/Filter';
import useRandomMovie from './useRandomMovie';

const isShowFilterAtom = atomWithStorage('is-show-filters', false);

const slideEffectProps: SwiperProps = {
  effect: 'coverflow',
  coverflowEffect: {
    slideShadows: false,
    depth: 200
  },
  virtual: {
    addSlidesAfter: 3,
    addSlidesBefore: 3
  },
  modules: [EffectCoverflow, Virtual]
};

export default function Container() {
  const [isShowFilter, setIsShowFilter] = useAtom(isShowFilterAtom);
  const { ref, hasPrevious, movies, movie, next, previous, index, onDrag, onIndexChange } = useRandomMovie();
  const isMounted = useMounted();
  const initialIndex = useRef(index);

  useUrlToMagnet();

  useEffect(() => {
    const queryClient = getQueryClient();

    queryClient.prefetchQuery({ queryKey: ['genres'], queryFn: () => genres() });
  }, []);

  const slides = useMemo(
    () => (
      <Swiper
        onSwiper={(instance) => (ref.current = instance)}
        lazyPreloadPrevNext={3}
        longSwipesRatio={0.2}
        speed={500}
        initialSlide={initialIndex.current}
        onActiveIndexChange={onIndexChange}
        onTouchMove={(swiper) => onDrag(swiper)}
        className='xs:w-[300px] w-full shrink-0'
        {...slideEffectProps}
      >
        {movies?.map((movie, index) => (
          <SwiperSlide key={movie.id} virtualIndex={index} className='cursor-grab active:cursor-grabbing'>
            <Card fit movie={movie} />
          </SwiperSlide>
        ))}
      </Swiper>
    ),
    [movies, onDrag, onIndexChange, ref]
  );

  return (
    <>
      {isShowFilter && <Filter />}
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
      <Movie movie={movie} className='bg-background rounded-md' card={slides}>
        <div className='gap-2 flex w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:static max-sm:z-10 max-sm:fixed max-sm:bottom-0 max-sm:left-0 max-sm:w-full max-sm:p-2 max-sm:px-2 max-sm:mb-0'>
          <Button className='grow h-8' onClick={previous} disabled={!hasPrevious} title='Previous movie'>
            <ArrowLeft size={24} />
          </Button>
          <Button className='grow h-8' onClick={next} title='Next movie'>
            <ArrowRight size={24} />
          </Button>
        </div>
      </Movie>
      <div className='w-full h-2 max-sm:h-12' />
    </>
  );
}
