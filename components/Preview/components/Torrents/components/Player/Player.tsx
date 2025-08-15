'use client';

import { FC, useEffect, useRef } from 'react';
import {
  MediaPlayer,
  MediaPlayerInstance,
  MediaProvider,
  PlayButton,
  Track,
  useMediaState,
  VideoSrc
} from '@vidstack/react';
import { NextIcon } from '@vidstack/react/icons';
import { PlyrLayout, plyrLayoutIcons } from '@vidstack/react/player/layouts/plyr';

import { cn } from '@/lib/utils';

import CaptionsMenu from './components/CaptionsMenu';
import PlaylistMenu from './components/PlaylistMenu';
import useSource from './useSource';

import '@vidstack/react/player/styles/plyr/theme.css';

interface Props {
  magnet: string;
  subtitles: Source[];
  videos: Source[];
}

const Player: FC<Props> = ({ videos, subtitles, magnet }) => {
  const { index, setIndex } = useSource({ magnet });

  const player = useRef<MediaPlayerInstance>(null);

  const isEnded = useMediaState('ended', player);

  const hasNext = index + 1 < videos?.length;

  useEffect(() => {
    if (!isEnded || !hasNext) return;

    setIndex((index) => index + 1);
  }, [isEnded, hasNext, setIndex]);

  const source = videos[index];

  return (
    <MediaPlayer
      playsInline
      load='eager'
      storage='movie-advisor'
      ref={player}
      src={(source as VideoSrc) || []}
      className='relative size-full select-none'
    >
      <MediaProvider className='relative flex size-full justify-center [&>video]:!h-full'>
        {subtitles.map((track, index) => (
          <Track key={track.name} src={track.src} kind='subtitles' label={track.name} type='srt' default={!index} />
        ))}
      </MediaProvider>
      <PlyrLayout
        icons={plyrLayoutIcons}
        slots={{
          playLargeButton: null,
          settingsMenu: null,
          captionsButton: null,
          afterPlayButton: hasNext && (
            <PlayButton onClick={() => setIndex(index + 1)} className={cn('plyr__controls__item plyr__control')}>
              <NextIcon className={cn('vds-icon')} />
              <span className={cn('plyr__tooltip')}>Next</span>
            </PlayButton>
          ),
          afterVolumeSlider: <ul className='w-2' />,
          beforeSettings: Boolean(subtitles.length) && <CaptionsMenu />,
          settings: videos.length > 1 && (
            <PlaylistMenu key={source?.src} source={source} sources={videos} onChange={setIndex} />
          )
        }}
      />
    </MediaPlayer>
  );
};

export default Player;
