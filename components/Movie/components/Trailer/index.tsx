'use client';

import { FC } from 'react';
import { create, InstanceProps } from 'react-modal-promise';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

import useTrailer from '@/app/(site)/useTrailer';
import { Modal } from '@/components/ui/dialog';

interface Props {
  movieId?: number;
}

const Trailer: FC<{ trailerKey?: string } & InstanceProps<void>> = ({ trailerKey, onResolve, isOpen }) => {
  if (!trailerKey) return;

  return (
    <Modal
      className='block p-0 min-h-[400px] border-none aspect-w-16 aspect-h-9'
      onClose={() => onResolve()}
      isOpen={isOpen}
    >
      <iframe
        allow='autoplay'
        className='border-none rounded-lg'
        width='100%'
        height='100%'
        src={`//www.youtube.com/embed/${trailerKey}?autoplay=1`}
        allowFullScreen
      />
    </Modal>
  );
};

export const showTrailerModal = create(Trailer);

export default function ToggleTrailer({ movieId }: Props) {
  const { data: trailer } = useTrailer({ movieId });

  return (
    trailer && (
      <motion.div
        onTap={() => showTrailerModal({ trailerKey: trailer?.key })}
        title='Play trailer'
        className='absolute w-full h-full left-0 top-0 bg-black cursor-pointer overflow-hidden rounded-lg transition-opacity opacity-0 hover:opacity-70 flex items-center justify-center'
      >
        <Play size={100} className='fill-white' />
      </motion.div>
    )
  );
}
