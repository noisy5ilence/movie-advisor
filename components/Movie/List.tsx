import { FC, Fragment, useLayoutEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

import Card from '@/components/Movie/Card';
import { showPreviewModal } from '@/components/Movie/Preview';
import filterUnknownMovies from '@/lib/filterUnknownMovies';

interface Props {
  pages: Array<MovieDBResponse>;
  hasNextPage?: boolean;
  fetchNextPage?: () => void;
  withBottomGap?: boolean;
  onPreviewClose?: () => void;
  type?: ShowType;
}

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const item = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

const List: FC<Props> = ({
  pages,
  hasNextPage,
  fetchNextPage,
  withBottomGap = true,
  onPreviewClose,
  type = 'movie'
}) => {
  const [loader, setLoader] = useState<HTMLLIElement>();

  useLayoutEffect(() => {
    if (!loader || !hasNextPage) return;

    const observer = new IntersectionObserver(
      ([{ isIntersecting }]) => {
        if (!isIntersecting) return;

        fetchNextPage?.();
      },
      {
        threshold: 1
      }
    );

    observer.observe(loader);

    return () => observer.disconnect();
  }, [fetchNextPage, loader, hasNextPage]);

  const shows = useMemo(
    () =>
      pages?.reduce((shows, page) => {
        shows.push(...filterUnknownMovies(page.results));
        return shows;
      }, [] as Movie[]) || [],
    [pages]
  );

  if (!shows.length) return null;

  return (
    <>
      <motion.ul
        className='flex gap-3 flex-wrap justify-center grow empty:hidden'
        variants={container}
        initial={pages.length === 1 ? 'hidden' : false}
        animate='visible'
      >
        {shows?.map((movie, index, array) => {
          const isAnchor = Math.round(array.length / 2) === index;

          return (
            <motion.li
              key={movie.id}
              variants={item}
              className='flex xs:w-auto w-full cursor-pointer'
              ref={isAnchor ? (element) => setLoader(element!) : undefined}
            >
              <Card fit movie={movie} onClick={() => showPreviewModal({ movie, onClose: onPreviewClose, type })} />
            </motion.li>
          );
        })}
      </motion.ul>
      {withBottomGap && <div className='h-2 w-full' />}
    </>
  );
};

export default List;
