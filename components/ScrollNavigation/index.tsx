import { ReactNode, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

interface Props<E extends HTMLElement> {
  className?: string;
  arrowsClassName?: string;
  backClassName?: string;
  nextClassName?: string;
  iconClassName?: string;
  gap?: number;
  children: (setScrollElement: (element: E) => void, isArrowHovered: boolean) => ReactNode;
}

function ScrollNavigation<E extends HTMLElement>({
  className,
  arrowsClassName,
  backClassName,
  nextClassName,
  iconClassName,
  gap = 0,
  children
}: Props<E>) {
  const [scrollElement, setScrollElement] = useState<E | null>(null);
  const [isShowBack, setIsShowBack] = useState(true);
  const [isShowNext, setIsShowNext] = useState(true);
  const [childWidth, setChildWidth] = useState(0);
  const [isArrowHovered, setIsArrowHovered] = useState(false);

  useEffect(() => {
    if (!scrollElement) return;

    let timeout: NodeJS.Timeout;

    if (scrollElement.firstChild) {
      setChildWidth((scrollElement.firstChild as HTMLElement).clientWidth + gap);
    }

    const handleScroll = () => {
      clearTimeout(timeout);

      const DELAY = 100;

      timeout = setTimeout(() => {
        setIsShowBack(Boolean(scrollElement.scrollLeft));
        setIsShowNext(Boolean(scrollElement.scrollWidth - (scrollElement.clientWidth + scrollElement.scrollLeft)));
      }, DELAY);
    };

    handleScroll();

    scrollElement.addEventListener('scroll', handleScroll);

    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
    };
  }, [scrollElement, gap]);

  const handleScrollNext = (direction: 1 | -1) => () => {
    if (!scrollElement) return;

    scrollElement.scrollTo({ left: scrollElement.scrollLeft + childWidth * direction, behavior: 'smooth' });
  };

  return (
    <div className={cn('relative group', className)}>
      {children(setScrollElement, isArrowHovered)}
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
          onMouseEnter={() => setIsArrowHovered(true)}
          onMouseLeave={() => setIsArrowHovered(false)}
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
