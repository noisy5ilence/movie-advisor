'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer';

const paths = [
  { path: '/popular', title: 'Popular' },
  { path: '/top', title: 'Top rated' },
  { path: '/favorites', title: 'Favorites' }
];

export function MobileNavigation() {
  const currentPath = usePathname();

  return (
    <div className='flex xs:hidden'>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant='ghost' size='icon'>
            <Menu size={19} />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className='pointer-events-none absolute'>
            <DrawerTitle />
            <DrawerDescription />
          </DrawerHeader>
          <ul className='flex flex-col gap-2 p-2'>
            {paths.map(({ path, title }) => (
              <li key={path}>
                <DrawerClose asChild>
                  <Button className='w-full relative' variant={currentPath === path ? 'default' : 'outline'}>
                    <Link href={path} className='absolute flex items-center justify-center w-full h-full top-0 left-0'>
                      {title}
                    </Link>
                  </Button>
                </DrawerClose>
              </li>
            ))}
          </ul>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export function DesktopNavigation() {
  const currentPath = usePathname();

  return (
    <ul className='hidden xs:flex items-center whitespace-nowrap text-sm gap-3'>
      {paths.map(({ path, title }) => (
        <li key={path} className={currentPath === path ? undefined : 'cursor-pointer'}>
          <Link href={path} shallow passHref legacyBehavior>
            <div>
              {currentPath === path ? (
                <Badge className='text-sm font-normal pointer-events-none' variant='secondary'>
                  {title}
                </Badge>
              ) : (
                title
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
