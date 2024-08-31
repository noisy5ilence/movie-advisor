import { FC, useMemo } from 'react';
import { VirtuosoGrid, VirtuosoGridProps } from 'react-virtuoso';

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

const components: VirtuosoGridProps<Movie, { shows: Movie[]; onClick: (movie: Movie) => void }>['components'] = {
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
        data={shows}
        context={context}
        components={components}
        listClassName='flex gap-2 flex-wrap justify-center grow empty:hidden opacity-0 animate-fade-in-slide-in'
        customScrollParent={customScrollParent}
        endReached={handleFetchMore}
      />
      <div className='h-2 w-full' />
    </>
  );
};

export default List;
