'use client';

import { FC } from 'react';
import { VirtuosoGrid, VirtuosoGridProps } from 'react-virtuoso';
import { useSetAtom } from 'jotai';

import Poster from '@/components/Poster';
import { previewSeedAtom } from '@/components/Preview/seed';

interface Props {
  shows: Show[];
  customScrollParent?: HTMLElement;
  fetchNextPage?: () => void;
  onNavigate?: () => void;
}

const components: VirtuosoGridProps<Movie, { shows: Show[]; onNavigate: (show: Show) => void }>['components'] = {
  Item: ({ context, 'data-index': index }) => {
    const { shows, onNavigate } = context!;
    const show = shows?.[index];

    if (!show) return null;

    return <Poster show={show} href={`/${show.type}/${show.id}`} onClick={() => onNavigate(show)} />;
  }
};

const List: FC<Props> = ({ shows, fetchNextPage, onNavigate, customScrollParent }) => {
  const setPreviewSeed = useSetAtom(previewSeedAtom);

  if (!shows.length) return null;

  const context = {
    shows,
    onNavigate: (show: Show) => {
      setPreviewSeed(show);
      onNavigate?.();
    }
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
