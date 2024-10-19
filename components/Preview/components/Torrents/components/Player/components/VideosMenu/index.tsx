import { FC } from 'react';
import { PlaylistIcon } from '@vidstack/react/icons';

import { cn } from '@/lib/utils';

import PlayerMenu from '../PlayerMenu';

interface Props {
  source: Source;
  sources: Source[];
  onChange: (index: number) => void;
}

const VideosMenu: FC<Props> = ({ sources, source, onChange }) => (
  <PlayerMenu
    options={sources.map(({ name }, index) => ({ label: name, onClick: () => onChange(index) }))}
    isChecked={({ label }) => source.name === label}
  >
    <PlaylistIcon className={cn('vds-icon !transform-none')} />
    <span className={cn('plyr__tooltip')}>Playlist</span>
  </PlayerMenu>
);

export default VideosMenu;
