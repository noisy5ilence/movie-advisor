import { FC, Fragment, useLayoutEffect, useState } from 'react';
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

const List: FC<Props> = ({ pages, hasNextPage, fetchNextPage, withBottomGap = true, onPreviewClose }) => {
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

  return (
    <>
      <motion.ul
        className='flex gap-3 flex-wrap justify-center grow'
        variants={container}
        initial={pages.length === 1 ? 'hidden' : false}
        animate='visible'
      >
        {pages.map((page) => (
          <Fragment key={page.page}>
            {filterUnknownMovies(page.results)?.map((movie, index, array) => {
              const isAnchor = Math.round(array.length / 2) === index;

              return (
                <motion.li
                  key={movie.id}
                  variants={item}
                  className='flex cursor-pointer'
                  ref={isAnchor ? (element) => setLoader(element!) : undefined}
                >
                  <Card fit movie={movie} onClick={() => showPreviewModal({ movie, onClose: onPreviewClose })} />
                </motion.li>
              );
            })}
          </Fragment>
        ))}
      </motion.ul>
      {withBottomGap && <div className='h-4 w-full' />}
    </>
  );
};

export default List;
