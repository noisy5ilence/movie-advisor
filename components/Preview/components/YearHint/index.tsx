import { FC } from 'react';

import Hint from '@/components/ui/hint';
import { getAvailabilityState, isUpcoming } from '@/data/dto/Availability';
import { formatDate } from '@/lib/utils';

function getLabels({ theatre, stream, bluray }: Availability, state: AvailabilityState) {
  if (state === 'bluray') return [bluray ? `On Blu-ray since ${formatDate(bluray)}` : 'On Blu-ray'];
  if (state === 'stream') return [stream ? `Streaming since ${formatDate(stream)}` : 'Streaming'];
  if (theatre && isUpcoming(theatre)) return [`In theatres from ${formatDate(theatre)}`];

  const announced = [
    stream && isUpcoming(stream) && `Streaming from ${formatDate(stream)}`,
    bluray && isUpcoming(bluray) && `Blu-ray from ${formatDate(bluray)}`
  ].filter(Boolean) as string[];

  return ['In theatres only', ...(announced.length ? announced : ['Streaming date to be announced'])];
}

const YearHint: FC<{ show: Show & Partial<Details> }> = ({ show }) => {
  const state = getAvailabilityState(show.availability!);
  if (!state) return <span>{new Date(show.release).getFullYear()}</span>;

  return (
    <Hint lines={getLabels(show.availability!, state)}>
      <span>{new Date(show.release).getFullYear()}</span>
    </Hint>
  );
};

export default YearHint;
