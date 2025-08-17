import { create, InstanceProps } from 'react-modal-promise';
import { DialogContentProps } from '@radix-ui/react-dialog';

import { Modal } from '@/components/ui/dialog';

import { useStats } from './useStats';

interface Props extends InstanceProps<void> {
  hash: string;
  backdrop: string;
  title: string;
  playerEntryId: string;
}

const showPlayerModal = create(({ onResolve, hash, backdrop, title, playerEntryId }: Props) => {
  const { isReady, preloadingProgress, downloadSpeed, peers } = useStats({ hash });

  const handlePlayerInteraction: DialogContentProps['onInteractOutside'] = (event) => {
    if (document.getElementById(playerEntryId)?.contains(event.target as Node)) event.preventDefault();
  };

  return (
    <Modal
      className='overflow-hidden border-none bg-black p-0'
      onClose={onResolve}
      onInteractOutside={handlePlayerInteraction}
      onPointerDownOutside={handlePlayerInteraction}
    >
      <div className='relative w-full overflow-hidden pt-[56.25%]'>
        {!isReady && (
          <div className='absolute left-0 top-0 size-full'>
            <img src={backdrop} className='absolute left-0 top-0 size-full' alt={title} />
            <div
              className='absolute left-0 top-0 flex size-full items-center justify-center bg-black/60 transition-all'
              style={{ width: `${100 - preloadingProgress}%` }}
            />
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
        <div className='absolute left-0 top-0 size-full' id={playerEntryId} />
      </div>
    </Modal>
  );
});

export default showPlayerModal;
