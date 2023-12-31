'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Navigation() {
  const path = usePathname();
  return (
    <Tabs value={path} className='flex-grow mt-2'>
      <TabsList className='grid w-full grid-cols-3'>
        {[
          ['/', 'Random'],
          ['/top', 'Top'],
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
  );
}
