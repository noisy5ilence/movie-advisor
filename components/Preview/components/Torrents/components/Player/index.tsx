import { useState } from 'react';
import { create, InstanceProps } from 'react-modal-promise';
import { Loader } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

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
  const [isReady, setIsReady] = useState(false);

  const {
    data: { subtitles, videos },
    error,
    isFetched,
    isLoading
  } = useFiles(magnet);

  const { toast } = useToast();

  if (error) {
    toast({ description: 'Download Failed: unable to retrieve the video' });
    onResolve();
  }

  if (isFetched && !videos.length) {
    toast({ description: 'This torrent doesn’t contain any compatible video files' });
    onResolve();
  }

  return (
    <Modal className='overflow-hidden border-none bg-black p-0' onClose={onResolve}>
      <div className='relative w-full overflow-hidden pt-[56.25%]'>
        <div className='absolute left-0 top-0 size-full'>
          <Player subtitles={subtitles} videos={videos} onReady={() => setIsReady(true)} />
        </div>
        {(!isReady || isLoading) && (
          <div className='absolute left-0 top-0 size-full'>
            <img src={backdrop} className='absolute left-0 top-0 size-full' alt={title} />
            <div className='absolute left-0 top-0 flex size-full items-center justify-center bg-black/80'>
              <div className='animate-spin'>
                <Loader color='white' />
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
});

export default showPlayer;
