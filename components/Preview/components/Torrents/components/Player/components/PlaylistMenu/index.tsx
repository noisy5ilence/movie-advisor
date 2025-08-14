import React, { FC } from 'react';
import { PlaylistIcon } from '@vidstack/react/icons';

import { cn } from '@/lib/utils';

import PlayerMenu from '../PlayerMenu';

interface Props {
  source: Source;
  sources: Source[];
  onChange: (index: number) => void;
}

const VideosMenu: FC<Props> = ({ sources, source, onChange }) => {
  const value = sources.findIndex(({ name }) => source.name === name);

  return (
    <PlayerMenu
      closeOnSelect
      value={value.toString()}
      options={sources.map(({ name }, index) => ({
        label: name,
        value: index.toString(),
        onSelect: () => onChange(index)
      }))}
    >
      <PlaylistIcon className={cn('vds-icon !transform-none')} />
      <span className={cn('plyr__tooltip')}>Playlist</span>
    </PlayerMenu>
  );
};

export default VideosMenu;
