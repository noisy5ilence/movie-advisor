'use client';

import { FC, useEffect, useRef, useState } from 'react';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const paths = [
  { path: '/', title: 'Random' },
  { path: '/popular', title: 'Popular' },
  { path: '/top', title: 'Top rated' },
  { path: '/favorites', title: 'Favorites' }
];

export function MobileNavigation() {
  const currentPath = usePathname();

  return (
    <div className='flex md:hidden'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon'>
            <Menu size={19} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-44 flex flex-col gap-2 p-2'>
          {paths.map(({ path, title }) => (
            <DropdownMenuItem key={path} asChild>
              <Link href={path}>
                <div>
                  <Button className='w-full relative' variant={currentPath === path ? 'default' : 'outline'}>
                    {title}
                  </Button>
                </div>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function DesktopNavigation() {
  const [position, setPosition] = useState({ left: 0, width: 0, opacity: 0 });
  const currentRef = useRef<HTMLLIElement>(null);
  const currentPath = usePathname();

  useEffect(() => {
    const link = currentRef.current;

    setPosition({ width: link?.clientWidth || 0, left: link?.offsetLeft || 0, opacity: link ? 1 : 0 });
  }, [currentPath]);

  return (
    <ul className='relative hidden md:flex items-center whitespace-nowrap text-sm gap-3'>
      {paths.map(({ path, title }) => (
        <li
          key={path}
          ref={currentPath !== path ? undefined : currentRef}
          className={cn('mix-blend-difference text-white z-10 px-2.5 py-0.5', currentPath !== path && 'cursor-pointer')}
        >
          <Link href={path}>
            <div>{title}</div>
          </Link>
        </li>
      ))}
      <Cursor options={position} />
    </ul>
  );
}

const Cursor: FC<{ options: { left: number; width: number; opacity: number } }> = ({ options }) => {
  return (
    <li
      className='pointer-events-none absolute bg-primary rounded-full h-full z-0 transition-all'
      style={{ width: options.width, left: options.left, opacity: options.opacity }}
    />
  );
};
