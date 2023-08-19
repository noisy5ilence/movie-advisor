import { FC } from 'react';

import { Dialog, DialogContent } from '@/components/ui/dialog';

interface Props {
  trailerKey?: string;
  onClose: () => void;
}

const Trailer: FC<Props> = ({ trailerKey, onClose }) => {
  return (
    trailerKey && (
      <Dialog defaultOpen={true} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className='block p-0 min-h-[400px] border-none aspect-w-16 aspect-h-9' onClose={onClose}>
          <iframe
            allow='autoplay'
            className='border-none rounded-lg'
            width='100%'
            height='100%'
            src={`//www.youtube.com/embed/${trailerKey}?autoplay=1`}
            allowFullScreen
          />
        </DialogContent>
      </Dialog>
    )
  );
};

export default Trailer;
