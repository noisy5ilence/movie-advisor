'use client';

import { forwardRef, ReactNode, startTransition, useEffect, useRef, useState } from 'react';
import { StateSnapshot, Virtuoso, VirtuosoHandle, VirtuosoProps } from 'react-virtuoso';

import Card from '@/components/Movie/Card';

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

let snapshot: StateSnapshot;

export const Carousel = ({
  movies,
  width: initialWidth,
  onIndexChange
}: {
  movies?: Movie[];
  width: number;
  onIndexChange: (index: number) => void;
}) => {
  const timeout = useRef<NodeJS.Timeout>();
  const isMobile = matchMedia('(max-width: 500px)').matches;
  const ref = useRef<VirtuosoHandle>(null);

  const width = isMobile ? initialWidth : 300;
  const height = isMobile ? (width * 3) / 2 : 450;

  useEffect(() => {
    const virtuoso = ref.current;
    return () => virtuoso?.getState((state) => (snapshot = state));
  }, []);

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
      restoreStateFrom={snapshot}
      components={components}
      itemContent={(index) => {
        clearTimeout(timeout.current);

        timeout.current = setTimeout(() => {
          const currentIndex = index - 1;

          startTransition(() => onIndexChange(currentIndex));
        }, 50);

        return <Card className='snap-start' movie={movies?.[index]} />;
      }}
    />
  );
};
