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
import { Loader } from 'lucide-react';

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

const initialStream: Stream = {
  magnet: '',
  subtitles: [],
  playlist: [sample]
};

export type PlayerControlRef = MutableRefObject<{
  sample: () => void;
  play: (options: { sources: Sources; magnet: string }) => void;
  stop: () => void;
}>;

interface Props {
  controlRef: PlayerControlRef;
}

const Player: FC<Props> = ({ controlRef }) => {
  const [{ magnet, playlist, subtitles }, setStream] = useState<Stream>(initialStream);
  const [canPlay, setCanPlay] = useState(false);

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
      .finally(() => setCanPlay(true));
  };

  useImperativeHandle(controlRef, () => ({
    sample() {
      handlePlay();
      setCanPlay(false);
    },
    play({ magnet, sources }) {
      setStream({ magnet, ...sources });
    },
    stop() {
      setStream(initialStream);
    }
  }));

  const pending = !canPlay || source === sample;

  return (
    <>
      <MediaPlayer
        load='eager'
        preload='none'
        storage='movie-advisor'
        ref={player}
        src={(source as VideoSrc) || []}
        onCanPlay={handlePlay}
        className={cn('relative size-full select-none', { invisible: pending })}
      >
        <MediaProvider className='relative flex size-full justify-center [&>video]:!h-full'>
          {subtitles.map((track, index) => (
            <Track key={track.name} src={track.src} kind='subtitles' label={track.name} type='srt' default={!index} />
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
      {pending && (
        <div className='absolute left-0 top-0 flex size-full items-center justify-center'>
          <div className='flex size-12 items-center justify-center rounded bg-black/60'>
            <div className='animate-spin'>
              <Loader color='white' />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Player;
