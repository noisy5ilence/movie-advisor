'use client';

import { FC, useRef } from 'react';
import { create, InstanceProps } from 'react-modal-promise';
import {
  MediaPlayer,
  MediaPlayerInstance,
  MediaProvider,
  Poster,
  Track,
  useActiveTextTrack,
  useCaptionOptions,
  useMediaPlayer,
  useMediaStore,
  VideoSrc
} from '@vidstack/react';
import { ClosedCaptionsIcon, ClosedCaptionsOnIcon, PlaylistIcon } from '@vidstack/react/icons';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';

import { Modal } from '@/components/ui/dialog';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';

import PlayerMenu from './components/PlayerMenu';
import useFiles from './useFiles';

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

interface Props {
  magnet: string;
  backdrop: string;
  className?: string;
}

const CaptionsMenu = () => {
  const track = useActiveTextTrack(['subtitles']);
  const tracks = useCaptionOptions();

  return (
    <PlayerMenu
      options={tracks.map((track) => ({ label: track.label, onClick: () => track.select() }))}
      isChecked={({ label }) => (label === 'Off' ? !track : label === track?.label)}
    >
      {track ? <ClosedCaptionsOnIcon className='vds-icon' /> : <ClosedCaptionsIcon className='vds-icon' />}
    </PlayerMenu>
  );
};

const VideosMenu = () => {
  const player = useMediaPlayer();
  const { sources, source } = useMediaStore();

  player?.remoteControl.console.log(sources, source);

  return null;

  return (
    <PlayerMenu
      options={tracks.map((track) => ({ label: track.label, onClick: () => track.select() }))}
      isChecked={({ label }) => (label === 'Off' ? !track : label === track?.label)}
    >
      {track ? <ClosedCaptionsOnIcon className='vds-icon' /> : <ClosedCaptionsIcon className='vds-icon' />}
    </PlayerMenu>
  );
};

export const Player: FC<Props> = ({ magnet, backdrop, className }) => {
  const { toast } = useToast();
  const player = useRef<MediaPlayerInstance>(null);

  const {
    data: { subtitles, videos }
  } = useFiles(magnet);

  return (
    <MediaPlayer
      ref={player}
      autoPlay
      load='eager'
      storage='movie-advisor'
      posterLoad='eager'
      aspectRatio='16/9'
      src={videos as VideoSrc[]}
      className={cn('size-full', className)}
      poster={backdrop}
    >
      <MediaProvider>
        <Poster className='vds-poster' src={backdrop} />
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
          beforeSettingsMenu: Boolean(videos.length) && <VideosMenu />,
          afterSettingsMenu: Boolean(subtitles.length) && <CaptionsMenu />
        }}
      />
    </MediaPlayer>
  );
};

const showPlayer = create(({ onResolve, magnet, backdrop, className }: Props & InstanceProps<void>) => {
  return (
    <Modal
      className='relative flex items-center justify-center overflow-hidden rounded-lg border-none bg-black p-0'
      style={{ aspectRatio: '16/9' }}
      onClose={onResolve}
    >
      <Player className={className} backdrop={backdrop} magnet={magnet} />
    </Modal>
  );
});

export default showPlayer;
