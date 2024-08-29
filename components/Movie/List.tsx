import { FC, useMemo, useRef } from 'react';
import { VirtuosoGrid, VirtuosoGridProps } from 'react-virtuoso';
import { motion } from 'framer-motion';

import Card from '@/components/Movie/Card';
import { showPreviewModal } from '@/components/Movie/Preview';
import filterUnknownMovies from '@/lib/filterUnknownMovies';

interface Props {
  pages: Array<MovieDBResponse>;
  hasNextPage?: boolean;
  fetchNextPage?: () => void;
  onPreviewClose?: () => void;
  type?: ShowType;
  customScrollParent?: HTMLElement;
}

const item = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

const components: VirtuosoGridProps<
  Movie,
  { shows: Movie[]; initial: boolean; onClick: (movie: Movie) => void }
>['components'] = {
  Item: ({ context, 'data-index': index }) => {
    const { shows, onClick } = context || {};
    const movie = shows?.[index];

    return (
      <motion.div
        variants={item}
        initial='hidden'
        animate='visible'
        transition={context?.initial ? { delay: 0.15 * index } : undefined}
        className='xs:w-[300px] xs:h-[450px] w-full h-full shrink-0'
      >
        <Card movie={movie} onClick={() => onClick?.(movie!)} />
      </motion.div>
    );
  }
};

const List: FC<Props> = ({ pages, hasNextPage, fetchNextPage, onPreviewClose, type = 'movie', customScrollParent }) => {
  const initial = useRef(true);

  const shows = useMemo(
    () =>
      pages?.reduce((shows, page) => {
        shows.push(...filterUnknownMovies(page.results));
        return shows;
      }, [] as Movie[]) || [],
    [pages]
  );

  if (!shows.length) return null;

  const context = {
    shows,
    initial: initial.current,
    onClick: (movie: Movie) => showPreviewModal({ movie, onClose: onPreviewClose, type })
  };

  const handleFetchMore = () => {
    if (!hasNextPage) return;
    initial.current = false;
    fetchNextPage?.();
  };

  return (
    <>
      <VirtuosoGrid
        useWindowScroll
        listClassName='flex gap-2 flex-wrap justify-center grow empty:hidden'
        customScrollParent={customScrollParent}
        totalCount={shows.length}
        initialItemCount={20}
        overscan={4}
        endReached={handleFetchMore}
        data={shows}
        context={context}
        components={components}
      />
      <div className='h-2 w-full' />
    </>
  );
};

export default List;
