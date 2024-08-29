'use client';

import { FC } from 'react';

import { useFavoriteToggle } from '@/app/(site)/favorites/useFavorites';

interface Props {
  movie: Movie;
  onClick?: () => void;
}

const Handlers: FC<Props> = ({ onClick, movie }) => {
  const { toggle } = useFavoriteToggle(movie);

  return <div onClick={onClick} onDoubleClick={toggle} className='absolute top-0 left-0 w-full h-full' />;
};

export default Handlers;
