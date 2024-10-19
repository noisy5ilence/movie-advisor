import { useActiveTextTrack, useCaptionOptions } from '@vidstack/react';
import { ClosedCaptionsIcon, ClosedCaptionsOnIcon } from '@vidstack/react/icons';

import { cn } from '@/lib/utils';

import PlayerMenu from '../PlayerMenu';

const CaptionsMenu = () => {
  const track = useActiveTextTrack(['subtitles']);
  const tracks = useCaptionOptions();

  return (
    <PlayerMenu
      options={tracks.map((track) => ({ label: track.label, onClick: () => track.select() }))}
      isChecked={({ label }) => (label === 'Off' ? !track : label === track?.label)}
    >
      {track ? (
        <ClosedCaptionsOnIcon className={cn('vds-icon !transform-none !size-5')} />
      ) : (
        <ClosedCaptionsIcon className={cn('vds-icon !transform-none !size-5')} />
      )}
      <span className={cn('plyr__tooltip')}>Subtitles</span>
    </PlayerMenu>
  );
};

export default CaptionsMenu;
