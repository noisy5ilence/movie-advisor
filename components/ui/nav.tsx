import { FC, ReactNode, useLayoutEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

type Tab = { title: string };

type CursorProps = { left: number; width: number; opacity: number };

const Cursor: FC<CursorProps> = ({ width, left, opacity }) => (
  <li
    className='pointer-events-none absolute bg-primary rounded-2xl h-full z-0 transition-all'
    style={{ width, left, opacity }}
  />
);

export type NavProps<T extends Tab> = {
  tabs: T[];
  className?: string;
  active: T;
  onChange?: (tab: T) => void;
  children?: (tab: T) => ReactNode;
};

function Nav<T extends Tab>({ tabs, active, className, children, onChange }: NavProps<T>) {
  const [cursor, setCursor] = useState({ left: 0, width: 0, opacity: 0 });
  const currentRef = useRef<HTMLLIElement>(null);

  useLayoutEffect(() => {
    const link = currentRef.current;

    setCursor({ width: link?.clientWidth || 0, left: link?.offsetLeft || 0, opacity: link ? 1 : 0 });
  }, [active?.title]);

  return (
    <ul className={cn('relative hidden md:flex items-center whitespace-nowrap text-[13px] gap-3', className)}>
      {tabs.map((tab) => {
        const { title } = tab;

        const isActive = title === active.title;

        return (
          <li
            key={title}
            ref={isActive ? currentRef : undefined}
            onClick={() => onChange?.(tab)}
            className={cn(
              'mix-blend-difference text-white z-10 px-2.5 py-0.5 font-normal cursor-default',
              !isActive && 'cursor-pointer'
            )}
          >
            {children?.(tab) || <div>{title}</div>}
          </li>
        );
      })}
      <Cursor {...cursor} />
    </ul>
  );
}

export default Nav;
