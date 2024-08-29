import { FC, forwardRef, useMemo } from 'react';
import { VirtuosoGrid, VirtuosoGridProps } from 'react-virtuoso';
import { motion } from 'framer-motion';

import Card from '@/components/Movie/Card';
import { showPreviewModal } from '@/components/Movie/Preview';
import filterUnknownMovies from '@/lib/filterUnknownMovies';

interface Props {
  type?: ShowType;
  pages: Array<MovieDBResponse>;
  hasNextPage?: boolean;
  customScrollParent?: HTMLElement;
  fetchNextPage?: () => void;
  onPreviewClose?: () => void;
}

const container = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

const components: VirtuosoGridProps<Movie, { shows: Movie[]; onClick: (movie: Movie) => void }>['components'] = {
  List: forwardRef(function List({ context, ...props }, ref) {
    return (
      <motion.div
        {...props}
        variants={container}
        initial='hidden'
        animate='visible'
        className='flex gap-2 flex-wrap justify-center grow empty:hidden'
        ref={ref}
      />
    );
  }),
  Item: ({ context, 'data-index': index }) => {
    const { shows, onClick } = context || {};
    const movie = shows?.[index];

    return <Card movie={movie} onClick={() => onClick?.(movie!)} />;
  }
};

const List: FC<Props> = ({ pages, hasNextPage, fetchNextPage, onPreviewClose, type = 'movie', customScrollParent }) => {
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
    onClick: (movie: Movie) => showPreviewModal({ movie, onClose: onPreviewClose, type })
  };

  const handleFetchMore = () => {
    if (!hasNextPage) return;
    fetchNextPage?.();
  };

  return (
    <>
      <VirtuosoGrid
        useWindowScroll
        customScrollParent={customScrollParent}
        totalCount={shows.length}
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
