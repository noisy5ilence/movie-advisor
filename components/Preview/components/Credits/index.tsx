'use client';

import { FC, ForwardedRef, forwardRef, useMemo } from 'react';
import { Virtuoso, VirtuosoProps } from 'react-virtuoso';
import Link from 'next/link';

import ScrollNavigation from '@/components/ScrollNavigation';
import { cn } from '@/lib/utils';

import useCredits from './useCredits';

interface Context {
  onClick?: (id: string) => void;
  width?: number;
  height?: number;
  gap?: number;
}

interface Props extends Context {
  showId: Show['id'];
  showType?: Show['type'];
}

const Credits: FC<Props> = ({ showId, showType = 'movie', onClick, width = 120, height = 180, gap = 8 }) => {
  const { data: credits } = useCredits({ showId, showType });

  const context = useMemo(() => ({ width, height, gap, onClick }), [width, height, gap, onClick]);

  if (!credits?.length) return null;

  return (
    <Virtuoso
      style={{ height }}
      horizontalDirection
      initialItemCount={10}
      increaseViewportBy={width * 10}
      data={credits}
      context={context}
      components={components}
    />
  );
};

const components: VirtuosoProps<Actor, Context>['components'] = {
  Item: ({ item: actor, children, context, ...props }) => {
    if (!actor) return null;

    return (
      <div
        {...props}
        title={actor.name}
        style={{ width: context?.width, height: context?.height }}
        className='relative shrink-0 cursor-pointer snap-start self-end bg-card text-card-foreground transition-shadow hover:shadow-lg'
      >
        <Link
          href={`/starring?actorId=${actor.id}&title=${encodeURIComponent(actor.name)}`}
          onClick={() => context?.onClick?.(actor.id.toString())}
        >
          <div className='overflow-hidden rounded-lg'>
            <img height={180} width={120} src={actor.photoUrl} alt={actor.name} />
          </div>
          <div className='absolute left-0 top-0 flex size-full flex-col justify-between rounded-md bg-vignette p-2 py-1 text-sm text-white'>
            <p className=' truncate'>{actor.name}</p>
            {Boolean(actor.character) && <p className='truncate'>{actor.character}</p>}
          </div>
        </Link>
      </div>
    );
  },
  List: forwardRef(function List({ context, ...props }, ref) {
    return <div {...props} ref={ref} style={{ ...props.style, display: 'flex', gap: context?.gap }} />;
  }),
  Scroller: forwardRef(function Scroller({ context, ...props }, ref) {
    const slideWidth = (context?.width || 0) + (context?.gap || 0);

    const handleRef =
      (ref: ForwardedRef<HTMLDivElement>, setRef: (element: HTMLDivElement) => void) =>
      (element: HTMLDivElement | null) => {
        if (!element || !ref) return;

        setRef(element);

        typeof ref === 'function' ? ref(element) : (ref.current = element);
      };

    return (
      <div className='animate-fade-aside-slide-in opacity-0'>
        <ScrollNavigation<HTMLDivElement> slideWidth={slideWidth}>
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
      </div>
    );
  })
};

export default Credits;
