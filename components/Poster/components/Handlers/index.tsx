'use client';

import { FC } from 'react';

import { useMutateShowState } from '@/hooks/useShowState';

interface Props {
  show: Show;
  onClick?: () => void;
}

const Handlers: FC<Props> = ({ onClick, show }) => {
  const { mutate } = useMutateShowState(show);

  return (
    <div
      onClick={onClick}
      onDoubleClick={() => mutate({ list: 'favorite', value: true })}
      className='absolute left-0 top-0 size-full'
    />
  );
};

export default Handlers;
