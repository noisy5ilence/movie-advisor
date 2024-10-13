'use client';

import { FC, useRef, useState } from 'react';
import { MediaPlayer, MediaPlayerInstance, MediaProvider, Track, VideoSrc } from '@vidstack/react';
import { PlyrLayout, plyrLayoutIcons } from '@vidstack/react/player/layouts/plyr';

import CaptionsMenu from './components/CaptionsMenu';
import VideosMenu from './components/VideosMenu';

interface Props {
  subtitles: Source[];
  videos: Source[];
  onReady: () => void;
}

const Player: FC<Props> = ({ videos, subtitles, onReady }) => {
  const [index, setIndex] = useState(0);

  const player = useRef<MediaPlayerInstance>(null);

  const source = videos[index];

  return (
    <MediaPlayer
      autoPlay
      onCanPlay={onReady}
      load='eager'
      storage='movie-advisor'
      ref={player}
      src={(source as VideoSrc) || []}
      className='size-full'
    >
      <MediaProvider>
        {subtitles.map((track) => (
          <Track key={track.name} src={track.src} kind='subtitles' label={track.name} type='srt' default />
        ))}
      </MediaProvider>
      <PlyrLayout
        icons={plyrLayoutIcons}
        slots={{
          playLargeButton: null,
          afterVolumeSlider: <ul className='w-2' />,
          beforeSettings: <CaptionsMenu />,
          settings: <VideosMenu source={source} sources={videos} onChange={setIndex} />,
          settingsMenu: null,
          captionsButton: null
        }}
      />
    </MediaPlayer>
  );
};

export default Player;
