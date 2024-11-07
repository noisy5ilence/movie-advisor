'use client';

import { ForwardedRef, forwardRef, memo, startTransition, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Virtuoso, VirtuosoProps } from 'react-virtuoso';

import Poster from '@/components/Poster';
import ScrollNavigation from '@/components/ScrollNavigation';
import { cn } from '@/lib/utils';

import { useSilentIndex } from '../../useRandomMovie';

interface Context {
  onIndexChange: (index: number) => void;
  gap?: number;
}

interface Props extends Context {
  shows?: Show[];
  onEndReached?: () => void;
}

const Carousel = memo(
  function Carousel({ shows, gap = 8, onIndexChange, onEndReached }: Props) {
    const index = useSilentIndex();
    const [loaded, setLoaded] = useState(!index);

    const context = useMemo(
      () => ({
        onIndexChange: (next: number) => {
          onIndexChange(next);

          if (loaded || next === index) return;

          startTransition(() => setLoaded(true));
        },
        gap
      }),
      [onIndexChange, gap, loaded, index]
    );

    return (
      <div className='card-aspect-ratio static-aspect-ratio relative mx-auto'>
        {!loaded && <Poster lazy={false} show={shows![index]} className='pointer-events-none absolute left-0 top-0' />}
        <Virtuoso
          initialItemCount={1}
          horizontalDirection
          skipAnimationFrameInResizeObserver={true}
          data={shows}
          context={context}
          endReached={onEndReached}
          initialTopMostItemIndex={index}
          components={components}
          increaseViewportBy={1000}
        />
      </div>
    );
  },
  (prev, next) => prev.shows === next.shows
);

const components: VirtuosoProps<Show, Context>['components'] = {
  Item: ({ item, children, context, ...props }) => {
    const ref = useRef<HTMLDivElement>(null);
    const index = props['data-index'];

    useLayoutEffect(() => {
      const container = ref.current;

      if (!container) return;

      const observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            context?.onIndexChange?.(index);
          }),
        {
          threshold: 0.7
        }
      );

      observer.observe(container);

      return () => observer.disconnect();
    }, [context, index]);

    return (
      <div {...props} ref={ref} className='snap-start'>
        <Poster lazy={false} show={item} className='static-aspect-ratio' />
      </div>
    );
  },
  List: forwardRef(function List({ context, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className='bg-background'
        style={{ ...props.style, display: 'flex', gap: context?.gap }}
      />
    );
  }),
  Scroller: forwardRef(function Scroller({ context, ...props }, ref) {
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
        gap={context?.gap}
      >
        {({ setScrollElement, isArrowHovered }) => (
          <div
            {...props}
            ref={handleRef(ref, setScrollElement)}
            className={cn('no-scrollbar h-full overflow-hidden rounded-lg', {
              'snap-x snap-mandatory': !isArrowHovered
            })}
          />
        )}
      </ScrollNavigation>
    );
  })
};

export default Carousel;
