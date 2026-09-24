'use client';

import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Nav from '@/components/ui/nav';
import { showTypeFromPath, toShowTypePath } from '@/lib/showType';
import { cn } from '@/lib/utils';

import { paths } from './constants';

export const MobileNavigation = () => {
  const currentPath = usePathname();
  const showType = showTypeFromPath(currentPath);

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
              <Link href={toShowTypePath(path, showType)} prefetch={path !== '/'}>
                <div>
                  <Button
                    className='relative w-full'
                    variant={toShowTypePath(path, showType) === currentPath ? 'default' : 'outline'}
                  >
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
  const showType = showTypeFromPath(currentPath);
  const active = paths.find(({ path }) => toShowTypePath(path, showType) === currentPath);

  return (
    <Nav tabs={paths} active={active}>
      {({ path, title }) => (
        <Link href={toShowTypePath(path, showType)} prefetch={path !== '/'}>
          <div>{title}</div>
        </Link>
      )}
    </Nav>
  );
};
