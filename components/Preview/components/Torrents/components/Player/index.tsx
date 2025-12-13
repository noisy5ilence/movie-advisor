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

import { useSetCanPlay } from '@/hooks/useCanPlay';
import { cn } from '@/lib/utils';

import Captions from './components/Captions';
import Playlist from './components/Playlist';
import useSource from './useSource';

import '@vidstack/react/player/styles/plyr/theme.css';

interface Props {
  magnet: string;
  subtitles: Source[];
  playlist: Source[];
}

const Player: FC<Props> = ({ magnet, playlist, subtitles }) => {
  const setCanPlay = useSetCanPlay();
  const { index, setIndex } = useSource({ magnet });

  const player = useRef<MediaPlayerInstance>(null);

  const isEnded = useMediaState('ended', player);

  const hasNext = index + 1 < playlist?.length;

  useEffect(() => {
    if (!isEnded || !hasNext) return;

    setIndex((index) => index + 1);
  }, [isEnded, hasNext, setIndex]);

  const source = playlist[index];

  return (
    <MediaPlayer
      playsInline
      autoPlay
      load='eager'
      preload='none'
      storage='movie-advisor'
      ref={player}
      src={(source as VideoSrc) || []}
      onCanPlay={() => setCanPlay(true)}
      className={cn('relative size-full select-none')}
    >
      <MediaProvider className='relative flex size-full justify-center [&>video]:!h-full'>
        {subtitles.map((track, index) => (
          <Track
            key={track.name}
            src={track.src}
            kind='subtitles'
            label={track.name}
            type='srt'
            default={!index}
            id={track.name}
          />
        ))}
      </MediaProvider>
      <PlyrLayout
        className='hidden'
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
          beforeSettings: Boolean(subtitles.length) && <Captions />,
          settings: playlist.length > 1 && (
            <Playlist key={source?.src} source={source} sources={playlist} onChange={setIndex} />
          )
        }}
      />
    </MediaPlayer>
  );
};

export default Player;
