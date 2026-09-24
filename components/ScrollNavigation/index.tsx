import { ReactNode, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

interface Props<E extends HTMLElement> {
  className?: string;
  arrowsClassName?: string;
  backClassName?: string;
  nextClassName?: string;
  iconClassName?: string;
  slideWidth?: number;
  gap?: number;
  onEndReached?: () => void;
  children: ({
    setScrollElement,
    isArrowHovered
  }: {
    setScrollElement: (element: E) => void;
    isArrowHovered: boolean;
  }) => ReactNode;
}

function ScrollNavigation<E extends HTMLElement>({
  className,
  arrowsClassName,
  backClassName,
  nextClassName,
  iconClassName,
  slideWidth: initialSlideWidth,
  gap = 0,
  onEndReached,
  children
}: Props<E>) {
  const [scrollElement, setScrollElement] = useState<E | null>(null);
  const scrollElementRef = useRef<E | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isArrowHoveredRef = useRef(false);
  const onEndReachedRef = useRef(onEndReached);
  const endReachedFiredRef = useRef(false);

  onEndReachedRef.current = onEndReached;

  const [isShowBack, setIsShowBack] = useState(true);
  const [isShowNext, setIsShowNext] = useState(true);

  const [isArrowHovered, setIsArrowHovered] = useState(false);

  useEffect(() => {
    scrollElementRef.current = scrollElement;
  }, [scrollElement]);

  const [childWidth, setChildWidth] = useState(0);

  const slideWidth = initialSlideWidth ?? childWidth + gap;

  useEffect(() => {
    if (!scrollElement) return;

    let timeout: NodeJS.Timeout;

    const slide = scrollElement.firstChild as HTMLElement;

    if (!initialSlideWidth && slide) {
      setChildWidth(slide.clientWidth);
    }

    const handleScroll = () => {
      clearTimeout(timeout);

      const DELAY = 50;

      timeout = setTimeout(() => {
        const remaining = scrollElement.scrollWidth - (scrollElement.clientWidth + scrollElement.scrollLeft);

        setIsShowBack(Boolean(scrollElement.scrollLeft));
        setIsShowNext(Boolean(remaining));

        if (onEndReachedRef.current) {
          const slide = scrollElement.firstChild as HTMLElement;
          const threshold = (slide?.clientWidth ?? 0) * 2 || 300;

          if (remaining <= threshold && !endReachedFiredRef.current) {
            endReachedFiredRef.current = true;
            onEndReachedRef.current();
          } else if (remaining > threshold) {
            endReachedFiredRef.current = false;
          }
        }
      }, DELAY);
    };

    handleScroll();

    scrollElement.addEventListener('scroll', handleScroll);

    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
    };
  }, [scrollElement, initialSlideWidth]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    let accumulated = 0;

    const handleWheel = (event: WheelEvent) => {
      if (!isArrowHoveredRef.current) return;

      const element = scrollElementRef.current;

      if (!element) return;

      const delta = event.deltaY;

      if (!delta) return;

      const atStart = element.scrollLeft <= 0;
      const atEnd = element.scrollLeft + element.clientWidth >= element.scrollWidth - 1;

      if ((delta > 0 && atEnd) || (delta < 0 && atStart)) {
        accumulated = 0;
        return;
      }

      event.preventDefault();

      if (accumulated * delta < 0) accumulated = 0;

      accumulated += delta;

      const first = element.querySelector('.snap-start') as HTMLElement | null;

      if (!first) return;

      const second = first.nextElementSibling as HTMLElement | null;
      const step = second ? second.offsetLeft - first.offsetLeft : first.clientWidth + gap;

      if (!step || Math.abs(accumulated) < step / 2) return;

      const index = Math.round(element.scrollLeft / step);
      const direction = accumulated > 0 ? 1 : -1;

      accumulated = 0;

      element.scrollTo({
        left: (index + direction) * step,
        behavior: 'smooth'
      });
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [gap]);

  const handleScrollNext = (direction: 1 | -1) => () => {
    if (!scrollElement) return;

    scrollElement.scrollTo({
      left: scrollElement.scrollLeft + slideWidth * direction,
      behavior: 'smooth'
    });
  };

  return (
    <div ref={containerRef} className={cn('relative group', className)}>
      {children({ setScrollElement, isArrowHovered })}
      {[
        {
          Arrow: ChevronLeft,
          isShow: isShowBack,
          handleScroll: handleScrollNext(-1),
          className: cn(
            'left-0 bg-gradient-to-r from-background to-transparent justify-start rounded-l-md',
            backClassName
          )
        },
        {
          Arrow: ChevronRight,
          isShow: isShowNext,
          handleScroll: handleScrollNext(1),
          className: cn(
            'right-0 bg-gradient-to-r from-transparent to-background justify-end rounded-r-md',
            nextClassName
          )
        }
      ].map(({ Arrow, isShow, handleScroll, className }) => (
        <div
          key={className}
          onClick={handleScroll}
          onMouseEnter={() => {
            isArrowHoveredRef.current = true;
            setIsArrowHovered(true);
          }}
          onMouseLeave={() => {
            isArrowHoveredRef.current = false;
            setIsArrowHovered(false);
          }}
          className={cn(
            'opacity-0 hover-none:hidden hover-none:pointer-events-none transition-opacity absolute top-1/2 transform -translate-y-1/2 bg-gradient-to-r h-full w-14 flex items-center cursor-pointer',
            {
              'group-hover:opacity-100 hover:!opacity-60': isShow,
              'pointer-events-none': !isShow
            },
            className,
            arrowsClassName
          )}
        >
          <Arrow className={cn('text-primary', iconClassName)} size={30} />
        </div>
      ))}
    </div>
  );
}

export default ScrollNavigation;
