'use client';

import { FC, useEffect, useRef, useState } from 'react';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Nav from '@/components/ui/nav';

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
  const currentPath = usePathname();
  const active = paths.find(({ path }) => path === currentPath);

  return (
    <Nav tabs={paths} active={active || paths[0]}>
      {({ path, title }) => (
        <Link href={path}>
          <div>{title}</div>
        </Link>
      )}
    </Nav>
  );
}
