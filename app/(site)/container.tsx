'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { ArrowLeft, ArrowRight, SlidersHorizontal } from 'lucide-react';
import { EffectCoverflow, Virtual } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import Card from '@/components/Movie/Card';
import Movie from '@/components/Movie/Preview';
import { Button } from '@/components/ui/button';
import useMounted from '@/hooks/useMounted';
import { genres } from '@/lib/api';
import getQueryClient from '@/lib/queryClient';

import Filter from './components/Filter';
import useRandomMovie from './useRandomMovie';

const isShowFilterAtom = atomWithStorage('is-show-filters', false);

const creativeEffectProps = {
  effect: 'coverflow',
  modules: [EffectCoverflow, Virtual]
};

export default function Container() {
  const [isShowFilter, setIsShowFilter] = useAtom(isShowFilterAtom);
  const { ref, hasPrevious, movies, movie, next, previous, index, onIndexChange } = useRandomMovie();
  const isMounted = useMounted();

  useEffect(() => {
    const queryClient = getQueryClient();

    queryClient.prefetchQuery({ queryKey: ['genres'], queryFn: () => genres() });
  }, []);

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
      <Movie
        movie={movie}
        className='bg-background rounded-md'
        renderCard={() => (
          <Swiper
            onSwiper={(instance) => (ref.current = instance)}
            lazyPreloadPrevNext={3}
            resistance={false}
            longSwipesRatio={0.3}
            speed={400}
            virtual
            initialSlide={index}
            onActiveIndexChange={onIndexChange}
            className='w-[300px] shrink-0'
            {...creativeEffectProps}
          >
            {movies?.map((movie, index) => (
              <SwiperSlide key={movie.id} virtualIndex={index}>
                <Card movie={movie} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      >
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
