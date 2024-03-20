import { FC, Fragment, useLayoutEffect, useState } from 'react';
import { motion } from 'framer-motion';

import Card from '@/components/Movie/Card';
import Preview from '@/components/Movie/Preview';
import { Modal } from '@/components/ui/dialog';
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
  const [movie, setMovie] = useState<Movie | null>(null);
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
                  className='flex basis-[300px] cursor-pointer'
                  ref={isAnchor ? (element) => setLoader(element!) : undefined}
                >
                  <Card movie={movie} className='grow flex flex-col' onClick={() => setMovie(movie)} />
                </motion.li>
              );
            })}
          </Fragment>
        ))}
      </motion.ul>
      {withBottomGap && <div className='h-4 w-full' />}
      <Modal isOpen={Boolean(movie)} onClose={() => setMovie(null)} className='block p-0'>
        {movie && (
          <Preview
            key={movie.id}
            movie={movie}
            className='border-none'
            onClose={() => {
              setMovie(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
              onPreviewClose?.();
            }}
          />
        )}
      </Modal>
    </>
  );
};

export default List;
