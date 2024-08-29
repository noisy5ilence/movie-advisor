'use client';

import { forwardRef, ReactNode, startTransition, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Virtuoso, VirtuosoHandle, VirtuosoProps } from 'react-virtuoso';

import Card from '@/components/Movie/Card';
import { cn } from '@/lib/utils';

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

export const Measurer = ({ children }: { children: (width: number) => ReactNode }) => {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const width = ref?.offsetWidth;

  return (
    <>
      <div ref={setRef} />
      {children(width || 0)}
    </>
  );
};

export const Carousel = ({
  movies,
  width: initialWidth,
  index,
  onIndexChange
}: {
  movies?: Movie[];
  width: number;
  index: number;
  onIndexChange: (index: number) => void;
}) => {
  const timeout = useRef<NodeJS.Timeout>();
  const isMobile = matchMedia('(max-width: 500px)').matches;
  const ref = useRef<VirtuosoHandle>(null);
  const initialIndex = useRef(index);
  const [snap, setSnap] = useState(true);

  const width = isMobile ? initialWidth : 300;
  const height = isMobile ? (width * 3) / 2 : 450;

  useLayoutEffect(() => {
    if (!ref.current) return;

    ref.current.scrollIntoView({ index: initialIndex.current });
  }, []);

  useEffect(() => {
    const scrollTo = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        if (index <= 0) return;
        setSnap(false);
        ref.current?.scrollIntoView({ index: index - 1, behavior: 'smooth' });
      }

      if (event.key === 'ArrowRight') {
        if (index >= (movies?.length || 0) - 1) return;
        setSnap(false);
        ref.current?.scrollIntoView({ index: index + 1, behavior: 'smooth' });
      }
    };

    document.addEventListener('keydown', scrollTo);

    return () => {
      document.removeEventListener('keydown', scrollTo);
      setTimeout(() => setSnap(true), 100);
    };
  }, [index, movies?.length]);

  return (
    <Virtuoso
      ref={ref}
      data={movies}
      defaultItemHeight={height}
      style={{ width, height, flexShrink: 0, margin: '0 auto' }}
      totalCount={movies?.length}
      horizontalDirection
      context={width}
      increaseViewportBy={154}
      components={components}
      itemContent={(index) => {
        clearTimeout(timeout.current);

        timeout.current = setTimeout(() => {
          const currentIndex = index - 1;

          startTransition(() => onIndexChange(currentIndex));
        }, 50);

        return <Card className={cn(snap && 'snap-start')} movie={movies?.[index]} />;
      }}
    />
  );
};
