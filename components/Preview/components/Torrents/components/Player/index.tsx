import { useEffect, useRef } from 'react';
import { create, InstanceProps } from 'react-modal-promise';
import { Loader } from 'lucide-react';
import dynamic from 'next/dynamic';

import { Modal } from '@/components/ui/dialog';
import { useToast } from '@/hooks/useToast';
import { formatBytes } from '@/lib/utils';

import useFiles from './useFiles';
import { useStats } from './useStats';

const Player = dynamic(() => import('./Player'));

interface Props extends InstanceProps<void> {
  magnet: string;
  hash?: string;
  backdrop: string;
  title: string;
}

const showPlayer = create(({ onResolve, magnet, hash, backdrop, title }: Props) => {
  const { subtitles, videos } = useFiles({ magnet, onResolve });

  const { isReady, preloadingProgress, downloadSpeed, peers } = useStats({ hash });

  return (
    <Modal className='overflow-hidden border-none bg-black p-0' onClose={onResolve}>
      <div className='relative w-full overflow-hidden pt-[56.25%]'>
        <div className='absolute left-0 top-0 size-full'>
          <Player magnet={magnet} subtitles={subtitles} videos={videos} />
        </div>
        {!isReady && (
          <div className='absolute left-0 top-0 size-full'>
            <img src={backdrop} className='absolute left-0 top-0 size-full' alt={title} />
            <div className='absolute left-0 top-0 flex size-full items-center justify-center bg-black/60 transition-all'>
              {!preloadingProgress && !peers && (
                <div className='animate-spin'>
                  <Loader color='white' />
                </div>
              )}
            </div>
            {(downloadSpeed || peers) && (
              <div className='absolute left-0 top-0 flex size-full flex-col items-center justify-center text-white'>
                <div className='flex h-[90px] w-[230px] flex-col items-center justify-center gap-2 rounded-xl bg-black/80 p-4 shadow-2xl'>
                  <p className='text-white/90'>Buffering: {preloadingProgress.toFixed()}%</p>
                  <p className='text-white/90'>Download speed: {downloadSpeed || '0 B/s'}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
});

export default showPlayer;
