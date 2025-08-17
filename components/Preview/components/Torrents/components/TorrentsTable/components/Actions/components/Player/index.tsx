import { create, InstanceProps } from 'react-modal-promise';
import { DialogContentProps } from '@radix-ui/react-dialog';
import { Loader } from 'lucide-react';

import { Modal } from '@/components/ui/dialog';
import { useCanPlay, useSetCanPlay } from '@/hooks/useCanPlay';

import { useStats } from './useStats';

interface Props extends InstanceProps<void> {
  hash: string;
  backdrop: string;
  title: string;
  playerEntryId: string;
}

const showPlayerModal = create(({ onResolve, hash, backdrop, title, playerEntryId }: Props) => {
  const canPlay = useCanPlay();
  const setCanPlay = useSetCanPlay();
  const { isReady, preloadingProgress, downloadSpeed } = useStats({ hash, canPlay });

  const handlePlayerInteraction: DialogContentProps['onInteractOutside'] = (event) => {
    if (document.getElementById(playerEntryId)?.contains(event.target as Node)) event.preventDefault();
  };

  const handleClose = () => {
    setCanPlay(false);
    onResolve();
  };

  return (
    <Modal
      className='overflow-hidden border-none bg-black p-0'
      onClose={handleClose}
      onInteractOutside={handlePlayerInteraction}
      onPointerDownOutside={handlePlayerInteraction}
    >
      <div className='relative w-full overflow-hidden pt-[56.25%]'>
        <div className='absolute left-0 top-0 size-full' id={playerEntryId} />
        {(!isReady || !canPlay) && (
          <div className='absolute left-0 top-0 size-full'>
            <img src={backdrop} className='absolute left-0 top-0 size-full' alt={title} />
            <div
              className='absolute left-0 top-0 flex size-full items-center justify-center bg-black/60 transition-all'
              style={{ width: `${100 - (canPlay ? 100 : preloadingProgress)}%` }}
            />
            <div className='absolute left-0 top-0 flex size-full items-center justify-center'>
              <div className='animate-spin'>
                <Loader color='white' />
              </div>
            </div>
            <div className='absolute left-0 top-0 flex size-full flex-col items-center justify-between text-sm text-white/90'>
              <div className='grid w-full items-center bg-black/80 p-2 text-center'>
                <p>Buffering: {preloadingProgress.toFixed()}%</p>
              </div>
              <div className='grid w-full items-center gap-2 bg-black/80 p-2 text-center'>
                <p>Download speed: {downloadSpeed || '0 B/s'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
});

export default showPlayerModal;
