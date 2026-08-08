'use client';

import { FC, MouseEvent } from 'react';
import Link from 'next/link';

import { useMutateShowState } from '@/hooks/useShowState';

interface Props {
  show: Show;
  href?: string;
  onClick?: () => void;
}

const Handlers: FC<Props> = ({ href, onClick, show }) => {
  const { mutate } = useMutateShowState(show);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (!onClick) return;

    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    onClick();
  };

  const handlers = {
    onClick: handleClick,
    onDoubleClick: () => mutate({ list: 'favorite', value: true }),
    className: 'absolute left-0 top-0 size-full'
  };

  if (!href) return <div {...handlers} />;

  return <Link {...handlers} href={href} prefetch={false} aria-label={show.title} />;
};

export default Handlers;
