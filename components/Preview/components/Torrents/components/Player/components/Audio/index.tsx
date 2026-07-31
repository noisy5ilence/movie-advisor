import { FC } from 'react';
import { AudioLines } from 'lucide-react';

import { cn } from '@/lib/utils';

import { GstAudioTrack } from '../../useGstAudio';
import PlayerMenu from '../Menu';

interface Props {
  tracks: GstAudioTrack[];
  value: number;
  onChange: (index: number) => void;
}

const AudioMenu: FC<Props> = ({ tracks, value, onChange }) => {
  if (tracks.length <= 1) return null;

  return (
    <PlayerMenu
      closeOnSelect
      value={value.toString()}
      options={tracks.map((track) => ({
        label: track.label,
        value: track.index.toString(),
        onSelect: () => onChange(track.index)
      }))}
    >
      <AudioLines size={18} className={cn('vds-icon !transform-none')} />
      <span className={cn('plyr__tooltip')}>Audio</span>
    </PlayerMenu>
  );
};

export default AudioMenu;
