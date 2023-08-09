'use client';

import { FC } from 'react';
import { Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/hooks/useTheme';

const Header: FC = () => {
  const path = usePathname();
  const [theme, setTheme] = useTheme();

  return (
    <header className='bg-background sticky pt-[12px] pb-2 top-0 z-10'>
      <div className='flex items-center justify-between'>
        <Link href='/'>
          <Badge className='whitespace-nowrap'>Movie advisor</Badge>
        </Link>
        <Button variant='outline' size='icon' onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'light' ? <Moon /> : <Sun />}
        </Button>
      </div>
      <Tabs value={path} className='flex-grow mt-2'>
        <TabsList className='grid w-full grid-cols-4'>
          {[
            ['/', 'Random'],
            ['/top', 'Top'],
            ['/search', 'Search'],
            ['/favorites', 'Favorites']
          ].map(([path, label]) => (
            <Link href={path} className='w-full' key={path}>
              <TabsTrigger className='w-full' value={path}>
                {label}
              </TabsTrigger>
            </Link>
          ))}
        </TabsList>
      </Tabs>
    </header>
  );
};

export default Header;
