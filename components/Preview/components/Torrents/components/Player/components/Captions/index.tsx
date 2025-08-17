import { useMemo } from 'react';
import { CaptionOption, useCaptionOptions } from '@vidstack/react';
import { ClosedCaptionsIcon, ClosedCaptionsOnIcon } from '@vidstack/react/icons';

import { cn } from '@/lib/utils';

import PlayerMenu from '../Menu';

const CaptionsMenu = () => {
  const tracks = useCaptionOptions();

  const captions = useMemo(() => {
    const record = tracks.reduce<Record<string, CaptionOption>>((record, track) => {
      record[track.value] = track;
      return record;
    }, {});

    return Object.values(record);
  }, [tracks]);

  return (
    <PlayerMenu
      closeOnSelect
      value={tracks.selectedValue}
      options={captions.map((track) => ({
        label: track.label,
        value: track.value,
        onSelect: () => track.select()
      }))}
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
