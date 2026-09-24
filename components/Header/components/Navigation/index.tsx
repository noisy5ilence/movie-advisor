'use client';

import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { useAtomValue } from 'jotai';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { showTypeAtom } from '@/components/ShowTypeToggle';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Nav from '@/components/ui/nav';
import { cn } from '@/lib/utils';

import { paths } from './constants';

const TYPE_AWARE_PATHS = ['/', '/popular', '/top', '/favorites', '/watchlist'];

const withShowType = (path: string, type: Show['type']) =>
  type === 'tv' && TYPE_AWARE_PATHS.includes(path) ? `${path}?type=tv` : path;

export const MobileNavigation = () => {
  const currentPath = usePathname();
  const showType = useAtomValue(showTypeAtom);

  return (
    <div className='flex md:hidden'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-label='Navigation toggle' variant='ghost' size='icon'>
            <Menu size={19} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='flex w-44 flex-col gap-2 rounded-none rounded-bl-lg border-none p-2'>
          {paths.map(({ path, title }) => (
            <DropdownMenuItem key={path} asChild>
              <Link href={withShowType(path, showType)} prefetch={path !== '/'}>
                <div>
                  <Button className='relative w-full' variant={currentPath === path ? 'default' : 'outline'}>
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
};

export const DesktopNavigation = () => {
  const currentPath = usePathname();
  const showType = useAtomValue(showTypeAtom);
  const active = paths.find(({ path }) => path === currentPath);

  return (
    <Nav tabs={paths} active={active}>
      {({ path, title }) => (
        <Link href={withShowType(path, showType)} prefetch={path !== '/'}>
          <div>{title}</div>
        </Link>
      )}
    </Nav>
  );
};
