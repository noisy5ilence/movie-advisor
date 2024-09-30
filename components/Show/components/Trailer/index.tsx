'use client';

import { ReactNode } from 'react';
import { create, InstanceProps } from 'react-modal-promise';

import { Modal } from '@/components/ui/dialog';

import useTrailer from './useTrailer';

interface Props {
  showId: Show['id'];
  showType?: Show['type'];
  children: ({ onPlay, disabled }: { onPlay: () => void; disabled: boolean }) => ReactNode;
}

const showTrailerModal = create(({ trailerKey, onResolve }: { trailerKey?: string } & InstanceProps<void>) => {
  if (!trailerKey) return;

  return (
    <Modal className='block p-0 max-w-[930px] border-none bg-black' style={{ aspectRatio: '16/9' }} onClose={onResolve}>
      <iframe
        allowFullScreen
        allow='autoplay'
        className='border-none rounded-lg'
        width='100%'
        height='100%'
        src={`//www.youtube.com/embed/${trailerKey}?autoplay=1`}
      />
    </Modal>
  );
});

const ToggleTrailer = ({ showId, showType = 'movie', children }: Props) => {
  const { data: trailer, isFetched } = useTrailer({ showId, showType });

  return children({ onPlay: () => showTrailerModal({ trailerKey: trailer?.key }), disabled: isFetched && !trailer });
};

export default ToggleTrailer;
