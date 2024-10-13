import { create, InstanceProps } from 'react-modal-promise';
import dynamic from 'next/dynamic';

import { Modal } from '@/components/ui/dialog';
import { useToast } from '@/hooks/useToast';

import useFiles from './useFiles';

const Player = dynamic(() => import('./Player'));

interface Props extends InstanceProps<void> {
  magnet: string;
  backdrop: string;
  title: string;
}

const showPlayer = create(({ onResolve, magnet, backdrop, title }: Props) => {
  const {
    data: { subtitles, videos },
    isFetched,
    isLoading
  } = useFiles(magnet);

  const { toast } = useToast();

  if (isFetched && !videos.length) {
    toast({ description: 'This torrent doesn\'t contain any compatible video files' });
    onResolve();
  }

  return (
    <Modal className='overflow-hidden rounded-lg border-none bg-black p-0' onClose={onResolve}>
      <div className='relative w-full overflow-hidden pt-[56.25%]'>
        <div className='absolute left-0 top-0 size-full'>
          <Player subtitles={subtitles} videos={videos} onClose={onResolve} />
        </div>
        {isLoading && <img src={backdrop} className='absolute left-0 top-0 size-full' alt={title} />}
      </div>
    </Modal>
  );
});

export default showPlayer;
