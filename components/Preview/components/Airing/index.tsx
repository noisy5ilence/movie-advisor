'use client';

import { FC } from 'react';

import Hint from '@/components/ui/hint';
import { formatDate } from '@/lib/utils';

interface Props {
  airing: Airing;
  className?: string;
}

const pad = (value: number) => String(value).padStart(2, '0');

const getLabels = ({ season, episode, seasons, ended, next }: Airing) => [
  `Season ${season}, episode ${episode}`,
  next
    ? `Next episode ${formatDate(next)}`
    : ended
      ? `Ended after ${seasons} season${seasons === 1 ? '' : 's'}`
      : 'Next episode date to be announced'
];

const Airing: FC<Props> = ({ airing, className }) => (
  <Hint lines={getLabels(airing)} className={className}>
    S{pad(airing.season)} E{pad(airing.episode)}
  </Hint>
);

export default Airing;
