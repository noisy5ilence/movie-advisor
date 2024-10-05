'use client';

import { FC } from 'react';

import { useFavoriteToggle } from '@/app/(site)/favorites/useFavorites';

interface Props {
  show: Show;
  onClick?: () => void;
}

const Handlers: FC<Props> = ({ onClick, show }) => {
  const { toggle } = useFavoriteToggle(show);

  return <div onClick={onClick} onDoubleClick={toggle} className='absolute left-0 top-0 size-full' />;
};

export default Handlers;
