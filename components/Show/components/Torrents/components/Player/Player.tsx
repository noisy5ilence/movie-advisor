'use client';

import { FC, useRef, useState } from 'react';
import { MediaPlayer, MediaPlayerInstance, MediaProvider, Track, VideoSrc } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';

import CaptionsMenu from './components/CaptionsMenu';
import VideosMenu from './components/VideosMenu';

interface Props {
  subtitles: Source[];
  videos: Source[];
  onClose: () => void;
}

const Player: FC<Props> = ({ videos, subtitles }) => {
  const [index, setIndex] = useState(0);

  const player = useRef<MediaPlayerInstance>(null);

  const source = videos[index];

  return (
    <MediaPlayer
      autoPlay
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
  );
};

export default Player;
