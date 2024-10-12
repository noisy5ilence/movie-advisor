'use client';

import { useRef, useState } from 'react';
import { create, InstanceProps } from 'react-modal-promise';
import { MediaPlayer, MediaPlayerInstance, MediaProvider, Poster, Track, VideoSrc } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';

import { Modal } from '@/components/ui/dialog';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';

import CaptionsMenu from './components/CaptionsMenu';
import VideosMenu from './components/VideosMenu';
import useFiles from './useFiles';

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

interface Props extends InstanceProps<void> {
  magnet: string;
  backdrop: string;
  className?: string;
  onClose: () => void;
}

const showPlayer = create(({ onResolve, magnet, backdrop, className }: Props) => {
  const [index, setIndex] = useState(0);

  const player = useRef<MediaPlayerInstance>(null);

  const {
    data: { subtitles, videos },
    isFetched
  } = useFiles(magnet);

  const source = videos[index];

  const { toast } = useToast();

  if (isFetched && !videos.length) {
    toast({ description: 'This torrent doesn\'t contain any compatible video files' });
    onResolve();
  }

  return (
    <Modal
      className='relative flex items-center justify-center overflow-hidden rounded-lg border-none bg-black p-0'
      style={{ aspectRatio: '16/9' }}
      onClose={onResolve}
    >
      <MediaPlayer
        autoPlay
        load='eager'
        posterLoad='eager'
        storage='movie-advisor'
        aspectRatio='16/9'
        ref={player}
        src={(source as VideoSrc) || []}
        className={cn('size-full', className)}
        poster={backdrop}
      >
        <MediaProvider>
          <Poster className={cn('vds-poster')} src={backdrop} />
          {subtitles.map((track) => (
            <Track key={track.name} src={track.src} kind='subtitles' label={track.name} type='srt' default />
          ))}
        </MediaProvider>
        <DefaultVideoLayout
          colorScheme='dark'
          icons={defaultLayoutIcons}
          slots={{
            settingsMenu: null,
            captionButton: null,
            googleCastButton: null,
            beforeSettingsMenu: Boolean(videos.length > 1) && (
              <VideosMenu source={source} sources={videos} onChange={setIndex} />
            ),
            afterSettingsMenu: Boolean(subtitles.length) && <CaptionsMenu />
          }}
        />
      </MediaPlayer>
    </Modal>
  );
});

export default showPlayer;
