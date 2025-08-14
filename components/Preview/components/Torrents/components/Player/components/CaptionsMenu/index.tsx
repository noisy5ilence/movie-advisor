import { useCaptionOptions } from '@vidstack/react';
import { ClosedCaptionsIcon, ClosedCaptionsOnIcon } from '@vidstack/react/icons';

import { cn } from '@/lib/utils';

import PlayerMenu from '../PlayerMenu';

const CaptionsMenu = () => {
  const tracks = useCaptionOptions();

  return (
    <PlayerMenu
      closeOnSelect
      value={tracks.selectedValue}
      options={tracks.map((track) => ({ label: track.label, value: track.value, onSelect: () => track.select() }))}
    >
      {tracks.selectedTrack ? (
        <ClosedCaptionsOnIcon className={cn('vds-icon !transform-none !size-5')} />
      ) : (
        <ClosedCaptionsIcon className={cn('vds-icon !transform-none !size-5')} />
      )}
      <span className={cn('plyr__tooltip')}>Subtitles</span>
    </PlayerMenu>
  );
};

export default CaptionsMenu;
