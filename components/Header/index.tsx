import { FC } from 'react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';

import Navigation, { NavigationSmall } from './components/Navigation';
import ToggleSearch from './components/Search';
import ToggleTheme from './components/ThemeToggle';

const Header: FC = () => (
  <header className='flex justify-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky py-2 top-0 z-20'>
    <div className='max-w-[1252px] w-full px-2'>
      <div className='flex items-center justify-between gap-2 md:flex-nowrap'>
        <Link href='/' shallow legacyBehavior>
          <Badge className='whitespace-nowrap cursor-pointer'>Movie advisor</Badge>
        </Link>
        <Navigation className='hidden sm:flex' />
        <div className='flex items-center gap-2'>
          <ToggleTheme />
          <ToggleSearch />
          <div id='actions' className='empty:hidden' />
          <NavigationSmall className='flex sm:hidden' />
        </div>
      </div>
    </div>
  </header>
);

export default Header;
