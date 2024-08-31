'use client';

import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import { StateSnapshot, Virtuoso, VirtuosoHandle, VirtuosoProps } from 'react-virtuoso';

import Card from '@/components/Movie/Card';

let snapshot: StateSnapshot;

const Carousel = ({
  index,
  movies,
  onIndexChange
}: {
  index: number;
  movies?: Movie[];
  onIndexChange: (index: number) => void;
}) => {
  const ref = useRef<VirtuosoHandle>(null);

  useEffect(() => {
    const virtuoso = ref.current;

    if (!virtuoso) return;

    return () => virtuoso.getState((state) => (snapshot = state));
  }, []);

  useEffect(() => {
    const scrollTo = ({ key }: globalThis.KeyboardEvent) => {
      if (key === 'ArrowLeft') {
        if (index <= 0) return;
        ref.current?.scrollIntoView({ index: index - 1, behavior: 'smooth' });
      }

      if (key === 'ArrowRight') {
        if (index >= (movies?.length || 0) - 1) return;
        ref.current?.scrollIntoView({ index: index + 1, behavior: 'smooth' });
      }
    };

    document.addEventListener('keydown', scrollTo);

    return () => {
      document.removeEventListener('keydown', scrollTo);
    };
  }, [index, movies?.length]);

  return (
    <div className='card-aspect-ratio mx-auto'>
      <Virtuoso
        ref={ref}
        data={movies}
        context={onIndexChange}
        horizontalDirection
        components={components}
        skipAnimationFrameInResizeObserver
        increaseViewportBy={1000}
        restoreStateFrom={snapshot}
      />
    </div>
  );
};

const components: VirtuosoProps<Movie, (index: number) => void>['components'] = {
  Item: ({ item, children, context: onIndexChange, ...props }) => {
    const ref = useRef<HTMLDivElement>(null);
    const index = props['data-index'];

    useLayoutEffect(() => {
      const container = ref.current;

      if (!container) return;

      const observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            onIndexChange?.(index);
          }),
        {
          threshold: 0.7
        }
      );

      observer.observe(container);

      return () => observer.disconnect();
    }, [onIndexChange, index]);

    return (
      <div {...props} ref={ref} className='snap-start'>
        <Card movie={item} />
      </div>
    );
  },
  List: forwardRef(function List({ context, ...props }, ref) {
    return <div {...props} ref={ref} style={{ ...props.style, display: 'flex' }} className='gap-2' />;
  }),
  Scroller: forwardRef(function Scroller({ context, ...props }, ref) {
    return (
      <div {...props} ref={ref} className='overflow-hidden no-scrollbar snap-mandatory snap-x rounded-lg h-full' />
    );
  })
};

export default Carousel;
