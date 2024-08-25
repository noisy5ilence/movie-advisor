import { FC, forwardRef, useMemo } from 'react';
import { VirtuosoGrid, VirtuosoGridProps } from 'react-virtuoso';

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

const components: VirtuosoGridProps<Movie, { shows: Movie[]; onClick: (movie: Movie) => void }>['components'] = {
  List: forwardRef(function List(props, ref) {
    return <div {...props} className='flex gap-3 flex-wrap justify-center grow empty:hidden' ref={ref} />;
  }),
  Item: ({ context, 'data-index': index }) => {
    const { shows, onClick } = context || {};
    const movie = shows?.[index];

    return <Card movie={movie} onClick={() => onClick?.(movie!)} />;
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
        totalCount={shows.length}
        endReached={handleFetchMore}
        data={shows}
        context={context}
        components={components}
      />
      {withBottomGap && <div className='h-2 w-full' />}
    </>
  );
};

export default List;
