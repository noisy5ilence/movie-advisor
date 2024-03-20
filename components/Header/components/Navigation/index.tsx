'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Navigation() {
  const path = usePathname();

  return (
    <Tabs value={path} className='flex-grow'>
      <TabsList className='flex w-full'>
        {[
          { path: '/', title: 'Random' },
          { path: '/popular', title: 'Popular' },
          { path: '/top', title: 'Top rated' },
          { path: '/favorites', title: 'Favorites' }
        ].map(({ path, title }) => (
          <Link href={path} className='w-full' key={path} shallow>
            <TabsTrigger className='w-full' value={path}>
              {title}
            </TabsTrigger>
          </Link>
        ))}
      </TabsList>
    </Tabs>
  );
}
