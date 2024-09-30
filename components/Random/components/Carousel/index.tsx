'use client';

import { FC, forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import { Virtuoso, VirtuosoHandle, VirtuosoProps } from 'react-virtuoso';

import Card from '@/components/Show';

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
        <Card show={item} />
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

interface Props {
  index: number;
  shows?: Show[];
  onIndexChange: (index: number) => void;
  onEndReached?: () => void;
}

const Carousel: FC<Props> = ({ index, shows, onIndexChange, onEndReached }) => {
  const ref = useRef<VirtuosoHandle>(null);
  const initialIndex = useRef(index);

  useEffect(() => {
    const scrollTo = ({ key }: globalThis.KeyboardEvent) => {
      if (key === 'ArrowLeft') {
        if (index <= 0) return;
        ref.current?.scrollIntoView({ index: index - 1, behavior: 'smooth' });
      }

      if (key === 'ArrowRight') {
        if (index >= (shows?.length || 0) - 1) return;
        ref.current?.scrollIntoView({ index: index + 1, behavior: 'smooth' });
      }
    };

    document.addEventListener('keydown', scrollTo);

    return () => {
      document.removeEventListener('keydown', scrollTo);
    };
  }, [index, shows?.length]);

  return (
    <div className='card-aspect-ratio mx-auto'>
      <Virtuoso
        ref={ref}
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
