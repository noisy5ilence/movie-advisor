import { useState } from 'react';
import { create, InstanceProps } from 'react-modal-promise';

import Player from '@/components/Preview/components/Torrents/components/Player';
import { Modal } from '@/components/ui/dialog';
import { useCanPlay, useSetCanPlay } from '@/hooks/useCanPlay';
import { cn } from '@/lib/utils';

import { useFiles } from './useFiles';
import { useStats } from './useStats';

interface Props extends InstanceProps<void> {
  hash: string;
  backdrop: string;
  title: string;
  magnet: string;
}

const showPlayerModal = create(({ onResolve, hash, backdrop, title, magnet }: Props) => {
  const canPlay = useCanPlay();
  const setCanPlay = useSetCanPlay();
  const { isReady, preloadingProgress, downloadSpeed } = useStats({ hash, canPlay });

  const sources = useFiles({ magnet });

  const [streamError, setStreamError] = useState<string>();

  const handleClose = () => {
    setCanPlay(false);
    onResolve();
  };

  return (
    <Modal className='overflow-hidden border-none bg-black p-0' onClose={handleClose}>
      <div className='relative w-full overflow-hidden rounded-xl pt-[56.25%]'>
        {/* keep the player mounted (Safari needs it for autoplay) but hidden until buffering is done,
            so its UI doesn't flash through the splash screen */}
        <div
          className={cn('absolute left-0 top-0 size-full', {
            'pointer-events-none opacity-0': streamError || !isReady || !canPlay
          })}
        >
          {sources && (
            <Player
              magnet={magnet}
              playlist={sources.playlist}
              subtitles={sources.subtitles}
              onStreamError={setStreamError}
            />
          )}
        </div>
        {streamError && (
          <div className='absolute left-0 top-0 flex size-full flex-col items-center justify-center gap-3 bg-black p-6 text-center text-white/90'>
            <p className='text-base font-medium'>This release can’t be played in the browser</p>
            <p className='text-sm text-white/60'>{streamError}</p>
            <p className='max-w-sm text-sm text-white/70'>
              The server can’t transcode this video. Use the playlist or VLC option to open it externally, or pick
              another release.
            </p>
          </div>
        )}
        {!streamError && (!isReady || !canPlay) && (
          <div className='absolute left-0 top-0 size-full overflow-hidden rounded-xl'>
            <img src={backdrop} className='absolute left-0 top-0 size-full' alt={title} />
            {/* dark cover recedes from the centre out to the top and bottom edges as it preloads */}
            <div
              className='absolute inset-x-0 top-0 bg-black/60 transition-[height] duration-700 ease-out'
              style={{ height: `${(100 - (canPlay ? 100 : preloadingProgress)) / 2}%` }}
            />
            <div
              className='absolute inset-x-0 bottom-0 bg-black/60 transition-[height] duration-700 ease-out'
              style={{ height: `${(100 - (canPlay ? 100 : preloadingProgress)) / 2}%` }}
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
      </div>
    </Modal>
  );
});

export default showPlayerModal;
