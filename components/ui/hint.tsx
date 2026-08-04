'use client';

import { FC, ReactNode, useState } from 'react';

import { cn } from '@/lib/utils';

interface Props {
  lines: string[];
  children: ReactNode;
  className?: string;
}

const Hint: FC<Props> = ({ lines, children, className }) => {
  const [open, setOpen] = useState(false);

  return (
    <span className={cn('relative z-10 inline-flex', className)}>
      <button
        type='button'
        aria-label={lines.join('. ')}
        className='inline-flex cursor-help items-center'
        onPointerEnter={({ pointerType }) => pointerType === 'mouse' && setOpen(true)}
        onPointerLeave={({ pointerType }) => pointerType === 'mouse' && setOpen(false)}
        onClick={() => setOpen((value) => !value)}
        onBlur={() => setOpen(false)}
      >
        {children}
      </button>
      <span
        role='tooltip'
        aria-hidden={!open}
        className={cn(
          'pointer-events-none absolute left-1/2 top-full z-10 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md border bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md transition-opacity',
          open ? 'opacity-100' : 'opacity-0'
        )}
      >
        {lines.map((line) => (
          <span key={line} className='block'>
            {line}
          </span>
        ))}
      </span>
    </span>
  );
};

export default Hint;
