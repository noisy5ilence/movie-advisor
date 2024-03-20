import { FC } from 'react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';

import Navigation from './components/Navigation';
import ToggleSearch from './components/Search';
import ToggleTheme from './components/ThemeToggle';

const Header: FC = () => (
  <header className='flex justify-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky pt-2 pb-2 top-0 z-10'>
    <div className='max-w-[1260px] w-full px-[12px]'>
      <div className='flex items-center justify-between gap-2 flex-wrap md:flex-nowrap'>
        <Link href='/'>
          <Badge className='whitespace-nowrap'>Movie advisor</Badge>
        </Link>
        <div className='w-full order-3 md:order-none'>
          <Navigation />
        </div>
        <div className='flex items-center gap-2'>
          <ToggleTheme />
          <ToggleSearch />
        </div>
      </div>
    </div>
  </header>
);

export default Header;
