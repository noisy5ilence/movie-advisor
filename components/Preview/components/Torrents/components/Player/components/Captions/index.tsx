import { useMemo, useRef } from 'react';
import { CaptionOption, useCaptionOptions } from '@vidstack/react';
import { ClosedCaptionsIcon, ClosedCaptionsOnIcon } from '@vidstack/react/icons';

import { track as track_ } from '@/lib/analytics';
import { cn } from '@/lib/utils';

import PlayerMenu from '../Menu';

const CaptionsMenu = () => {
  const tracks = useCaptionOptions();

  const live = useRef(tracks);
  live.current = tracks;

  const captions = useMemo(() => {
    const record = tracks.reduce<Record<string, CaptionOption>>((record, track) => {
      record[track.value] = track;
      return record;
    }, {});

    return Object.values(record);
  }, [tracks]);

  if (!captions.length) return null;

  return (
    <PlayerMenu
      closeOnSelect
      value={tracks.selectedValue}
      options={captions.map((track) => ({
        label: track.label,
        value: track.value,
        onSelect: (value) => {
          track_('subtitles_selected', { language: value });

          return (live.current.find((option) => option.value === value) ?? track).select();
        }
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
