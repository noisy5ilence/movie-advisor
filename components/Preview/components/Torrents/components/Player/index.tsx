'use client';

import { FC, useEffect, useMemo, useRef } from 'react';
import {
  isHLSProvider,
  MediaPlayer,
  MediaPlayerInstance,
  MediaProvider,
  MediaProviderAdapter,
  PlayButton,
  Track,
  useMediaState,
  VideoSrc
} from '@vidstack/react';
import { NextIcon } from '@vidstack/react/icons';
import { PlyrLayout, plyrLayoutIcons } from '@vidstack/react/player/layouts/plyr';

import { useSetCanPlay } from '@/hooks/useCanPlay';
import { cn } from '@/lib/utils';

import Audio from './components/Audio';
import Captions from './components/Captions';
import Playlist from './components/Playlist';
import { useGstAudio } from './useGstAudio';
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

  const { tracks: audioTracks, audio, setAudio, resolvedSrc } = useGstAudio(source?.src);

  const resumeTime = useRef(0);

  const changeAudio = (track: number) => {
    resumeTime.current = player.current?.currentTime ?? 0;
    setAudio(track);
  };

  const playerSrc = useMemo(() => (source ? ({ ...source, src: resolvedSrc } as VideoSrc) : []), [source, resolvedSrc]);

  const onProviderChange = (provider: MediaProviderAdapter | null) => {
    if (isHLSProvider(provider)) {
      provider.config = {
        backBufferLength: 15,
        maxBufferLength: 20,
        maxMaxBufferLength: 40,
        maxBufferSize: 30 * 1000 * 1000
      };
    }
  };

  return (
    <MediaPlayer
      playsInline
      autoPlay
      crossOrigin
      load='eager'
      preload='none'
      storage='movie-advisor'
      ref={player}
      src={playerSrc}
      onProviderChange={onProviderChange}
      onCanPlay={() => {
        setCanPlay(true);
        if (resumeTime.current) {
          player.current!.currentTime = resumeTime.current;
          resumeTime.current = 0;
        }
      }}
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
          beforeSettings: (
            <>
              <Audio tracks={audioTracks} value={audio} onChange={changeAudio} />
              <Captions />
            </>
          ),
          settings: playlist.length > 1 && (
            <Playlist key={source?.src} source={source} sources={playlist} onChange={setIndex} />
          )
        }}
      />
    </MediaPlayer>
  );
};

export default Player;
