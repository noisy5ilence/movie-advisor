'use client';

import { FC, ReactNode } from 'react';
import { create, InstanceProps } from 'react-modal-promise';
import { Play } from 'lucide-react';

import useTrailer from '@/app/(site)/useTrailer';
import { Modal } from '@/components/ui/dialog';

interface Props {
  movieId?: number;
  children?: ({ onPlay, disabled }: { onPlay: () => void; disabled: boolean }) => ReactNode;
  type?: ShowType;
}

const Trailer: FC<{ trailerKey?: string } & InstanceProps<void>> = ({ trailerKey, onResolve }) => {
  if (!trailerKey) return;

  return (
    <Modal className='block p-0 min-h-[400px] border-none' style={{ aspectRatio: '16/9' }} onClose={onResolve}>
      <iframe
        allow='autoplay'
        className='border-none rounded-lg'
        style={{ aspectRatio: '16/9' }}
        width='100%'
        height='100%'
        src={`//www.youtube.com/embed/${trailerKey}?autoplay=1`}
        allowFullScreen
      />
    </Modal>
  );
};

export const showTrailerModal = create(Trailer);

export default function ToggleTrailer({ movieId, type = 'movie', children }: Props) {
  const { data: trailer, isFetched } = useTrailer({ movieId, type });

  return children
    ? children({ onPlay: () => showTrailerModal({ trailerKey: trailer?.key }), disabled: isFetched && !trailer })
    : trailer && (
        <div
          onClick={() => showTrailerModal({ trailerKey: trailer?.key })}
          title='Play trailer'
          className='absolute w-full h-full left-0 top-0 bg-black cursor-pointer overflow-hidden rounded-lg transition-opacity opacity-0 hover:opacity-70 flex items-center justify-center'
        >
          <Play size={100} className='fill-white' />
        </div>
      );
}
