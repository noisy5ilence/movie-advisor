'use client';

import { FC, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

interface Props {
  text: string;
}

const Biography: FC<Props> = ({ text }) => {
  const [open, setOpen] = useState(false);
  const [overflows, setOverflows] = useState(false);

  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const element = textRef.current;

    if (!element) return;

    const measure = () => setOverflows(element.scrollHeight > element.clientHeight + 1);

    measure();

    const observer = new ResizeObserver(measure);

    observer.observe(element);

    return () => observer.disconnect();
  }, [text]);

  if (!text) return null;

  return (
    <div
      className='relative z-10 grow animate-fade-aside-slide-in opacity-0 md:min-h-0'
      onPointerEnter={({ pointerType }) => pointerType === 'mouse' && overflows && setOpen(true)}
      onPointerLeave={({ pointerType }) => pointerType === 'mouse' && setOpen(false)}
    >
      <div className='flex flex-col md:absolute md:inset-0'>
        <p ref={textRef} className='min-h-0 grow whitespace-pre-line md:overflow-hidden'>
          {text}
        </p>
        {overflows && (
          <span className='pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-background' />
        )}
      </div>
      {overflows && (
        <div
          role='tooltip'
          aria-hidden={!open}
          className={cn(
            'absolute inset-x-0 top-0 hidden max-h-[70vh] overflow-y-auto rounded-lg border bg-popover p-3 text-popover-foreground shadow-md transition-opacity md:block',
            open ? 'opacity-100' : 'pointer-events-none opacity-0'
          )}
        >
          <p className='whitespace-pre-line'>{text}</p>
        </div>
      )}
    </div>
  );
};

export default Biography;
