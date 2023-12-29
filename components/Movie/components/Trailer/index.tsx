import { FC } from 'react';
import { create, InstanceProps } from 'react-modal-promise';

import { Modal } from '@/components/ui/dialog';

interface Props extends InstanceProps<void> {
  trailerKey?: string;
}

const Trailer: FC<Props> = ({ trailerKey, onResolve, isOpen }) => {
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

export default Trailer;
