'use client';

import { FC, ForwardedRef, forwardRef, useLayoutEffect, useRef } from 'react';
import { Virtuoso, VirtuosoProps } from 'react-virtuoso';

import Poster from '@/components/Poster';
import ScrollNavigation from '@/components/ScrollNavigation';
import { cn } from '@/lib/utils';

const components: VirtuosoProps<Show, (index: number) => void>['components'] = {
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
        <Poster show={item} />
      </div>
    );
  },
  List: forwardRef(function List({ context, ...props }, ref) {
    return <div {...props} ref={ref} style={{ ...props.style, display: 'flex' }} className='gap-2' />;
  }),
  Scroller: forwardRef(function Scroller({ context, ...props }, ref) {
    const GAP_BETWEEN_SLIDES = 8; // gap-2 = 0.5rem = 8px

    const handleRef =
      (ref: ForwardedRef<HTMLDivElement>, setRef: (element: HTMLDivElement) => void) =>
      (element: HTMLDivElement | null) => {
        if (!element || !ref) return;

        setRef(element);

        typeof ref === 'function' ? ref(element) : (ref.current = element);
      };

    return (
      <ScrollNavigation<HTMLDivElement>
        className='size-full'
        arrowsClassName='h-20 bg-secondary'
        backClassName='rounded-none rounded-r-full'
        nextClassName='rounded-none rounded-l-full'
        gap={GAP_BETWEEN_SLIDES}
      >
        {(setRef, isArrowHovered) => (
          <div
            {...props}
            ref={handleRef(ref, setRef)}
            className={cn('no-scrollbar h-full overflow-hidden rounded-lg', {
              'snap-x snap-mandatory ': !isArrowHovered
            })}
          />
        )}
      </ScrollNavigation>
    );
  })
};

interface Props {
  index: number;
  shows?: Show[];
  onIndexChange: (index: number) => void;
  onEndReached?: () => void;
}

const Carousel: FC<Props> = ({ index, shows, onIndexChange, onEndReached }) => {
  const initialIndex = useRef(index);

  return (
    <div className='card-aspect-ratio mx-auto'>
      <Virtuoso
        data={shows}
        context={onIndexChange}
        endReached={onEndReached}
        initialTopMostItemIndex={initialIndex.current}
        components={components}
        horizontalDirection
        skipAnimationFrameInResizeObserver
        increaseViewportBy={1000}
      />
    </div>
  );
};

export default Carousel;
