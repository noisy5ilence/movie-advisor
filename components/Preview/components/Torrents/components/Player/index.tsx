'use client';

import { FC, MutableRefObject, useEffect, useImperativeHandle, useRef, useState } from 'react';
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

import { useCanPlay, useSetCanPlay } from '@/hooks/useCanPlay';
import { cn } from '@/lib/utils';

import Captions from './components/Captions';
import Playlist from './components/Playlist';
import useSource from './useSource';

import '@vidstack/react/player/styles/plyr/theme.css';

interface Stream {
  magnet: string;
  subtitles: Source[];
  playlist: Source[];
}

const sample = { type: 'video/mp4', src: '/sample.mp4', name: 'Sample' };

export type PlayerControlRef = MutableRefObject<{
  play: (options: { sources: Sources; magnet: string }) => void;
}>;

interface Props {
  controlRef: PlayerControlRef;
}

const Player: FC<Props> = ({ controlRef }) => {
  const [{ magnet, playlist, subtitles }, setStream] = useState<Stream>({
    magnet: '',
    subtitles: [],
    playlist: [sample]
  });
  const canPlay = useCanPlay();
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

  const handlePlay = () => {
    if (!player.current) return;

    player.current
      .play()
      .catch(() => {})
      .finally(() => {
        if (source === sample) return;

        setCanPlay(true);
      });
  };

  useImperativeHandle(controlRef, () => ({
    play({ magnet, sources }) {
      setStream({ magnet, ...sources });
      setCanPlay(false);
    }
  }));

  const pending = !canPlay;

  return (
    <MediaPlayer
      playsInline
      autoPlay
      load='eager'
      preload='none'
      storage='movie-advisor'
      ref={player}
      loop={pending}
      src={(source as VideoSrc) || []}
      onCanPlay={handlePlay}
      className={cn('relative size-full select-none', { invisible: pending })}
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
