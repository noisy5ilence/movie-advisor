'use client';

import { FC } from 'react';
import { Disc, MonitorPlay, Popcorn } from 'lucide-react';

import Hint from '@/components/ui/hint';
import { getAvailabilityState, isUpcoming } from '@/data/dto/Availability';
import { formatDate } from '@/lib/utils';

interface Props {
  availability: Availability;
  className?: string;
}

const ICONS = {
  theatre: Popcorn,
  stream: MonitorPlay,
  bluray: Disc
};

const getLabels = ({ theatre, stream, bluray }: Availability, state: AvailabilityState) => {
  if (state === 'bluray') return [bluray ? `On Blu-ray since ${formatDate(bluray)}` : 'On Blu-ray'];
  if (state === 'stream') return [stream ? `Streaming since ${formatDate(stream)}` : 'Streaming'];
  if (theatre && isUpcoming(theatre)) return [`In theatres from ${formatDate(theatre)}`];

  const announced = [
    stream && isUpcoming(stream) && `Streaming from ${formatDate(stream)}`,
    bluray && isUpcoming(bluray) && `Blu-ray from ${formatDate(bluray)}`
  ].filter(Boolean) as string[];

  return ['In theatres only', ...(announced.length ? announced : ['Streaming date to be announced'])];
};

const Availability: FC<Props> = ({ availability, className }) => {
  const state = getAvailabilityState(availability);

  if (!state) return null;

  const Icon = ICONS[state];

  return (
    <Hint lines={getLabels(availability, state)} className={className}>
      <Icon size={16} />
    </Hint>
  );
};

export default Availability;
