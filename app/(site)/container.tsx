'use client';

import { forwardRef, ReactNode, UIEvent, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Virtuoso, VirtuosoProps } from 'react-virtuoso';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { SlidersHorizontal } from 'lucide-react';

import Card from '@/components/Movie/Card';
import Preview from '@/components/Movie/Preview';
import { Button } from '@/components/ui/button';
import useMounted from '@/hooks/useMounted';
import useUrlToMagnet from '@/hooks/useUrlToMagnet';
import { genres } from '@/lib/api';
import getQueryClient from '@/lib/queryClient';

import Filter from './components/Filter';
import useRandomMovie from './useRandomMovie';

const isShowFilterAtom = atomWithStorage('is-show-filters', false);

const components: VirtuosoProps<Movie, number>['components'] = {
  Item: (props) => <div {...props} className='shrink-0' style={{ ...props.style, width: props.context }} />,
  List: forwardRef(function List(props, ref) {
    return (
      <div {...props} ref={ref} className='gap-2' style={{ ...props.style, display: 'flex', width: props.context }} />
    );
  }),
  Scroller: forwardRef(function Scroller(props, ref) {
    return <div {...props} ref={ref} className='overflow-hidden no-scrollbar snap-mandatory snap-x rounded-lg' />;
  })
};

const Measurer = ({ children }: { children: (width: number) => ReactNode }) => {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const width = ref?.offsetWidth;

  return (
    <>
      <div ref={setRef} />
      {children(width || 0)}
    </>
  );
};

const Carousel = ({
  movies,
  index = 0,
  width: initialWidth,
  onIndexChange
}: {
  movies?: Movie[];
  width: number;
  index: number;
  onIndexChange: (index: number) => void;
}) => {
  const timeout = useRef<NodeJS.Timeout>();
  const isMobile = matchMedia('(max-width: 500px)').matches;

  const width = isMobile ? initialWidth : 300;
  const height = isMobile ? (width * 3) / 2 : 450;

  const handleScroll = (event: UIEvent) => {
    clearTimeout(timeout.current);

    timeout.current = setTimeout(() => {
      const gap = 8;
      const item = event.target as HTMLDivElement;
      const itemWidth = item?.clientWidth + gap;
      const scrollPosition = item?.scrollLeft;

      const index = Math.round(scrollPosition / itemWidth);

      onIndexChange(index);
    }, 50);
  };

  return (
    <Virtuoso
      data={movies}
      firstItemIndex={index}
      style={{ width, height, flexShrink: 0 }}
      totalCount={movies?.length}
      horizontalDirection
      context={width}
      // onScroll={handleScroll}
      components={components}
      itemContent={(index) => {
        clearTimeout(timeout.current);

        timeout.current = setTimeout(() => {
          console.log(index);
          // onIndexChange(index);
        }, 100);
        return <Card className='snap-start' movie={movies?.[index]} />;
      }}
    />
  );
};

export default function Container() {
  const [isShowFilter, setIsShowFilter] = useAtom(isShowFilterAtom);
  const { movies, movie, index, onIndexChange } = useRandomMovie();
  const isMounted = useMounted();
  const initialIndex = useRef(index);

  useUrlToMagnet();

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
      <Measurer>
        {(width) => (
          <Preview
            movie={movie}
            className='bg-background rounded-md'
            card={<Carousel index={initialIndex.current} width={width} movies={movies} onIndexChange={onIndexChange} />}
          />
        )}
      </Measurer>
      <div className='w-full h-2 max-sm:h-12' />
    </>
  );
}
