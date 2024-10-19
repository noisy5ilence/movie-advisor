import { FC } from 'react';
import { VirtuosoGrid, VirtuosoGridProps } from 'react-virtuoso';

import Poster from '@/components/Poster';
import { showPreviewModal } from '@/components/Preview';

interface Props {
  shows: Show[];
  customScrollParent?: HTMLElement;
  fetchNextPage?: () => void;
  onPreviewClose?: () => void;
}

const components: VirtuosoGridProps<Movie, { shows: Show[]; onClick: (show: Show) => void }>['components'] = {
  Item: ({ context, 'data-index': index }) => {
    const { shows, onClick } = context!;
    const show = shows?.[index];

    if (!show) return null;

    return <Poster show={show} onClick={() => onClick?.(show)} />;
  }
};

const List: FC<Props> = ({ shows, fetchNextPage, onPreviewClose, customScrollParent }) => {
  if (!shows.length) return null;

  const context = {
    shows,
    onClick: (show: Show) => showPreviewModal({ show, onClose: onPreviewClose })
  };

  const handleFetchMore = () => fetchNextPage?.();

  return (
    <>
      <VirtuosoGrid
        useWindowScroll
        initialItemCount={20}
        overscan={10}
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
