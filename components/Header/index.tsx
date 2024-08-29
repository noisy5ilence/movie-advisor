import { FC } from 'react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';

import { DesktopNavigation, MobileNavigation } from './components/Navigation';
import ToggleSearch from './components/Search';
import ToggleTheme from './components/ThemeToggle';

const Header: FC = () => (
  <header className='flex justify-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2'>
    <div className='max-w-[1240px] w-full px-2'>
      <div className='flex items-center justify-between gap-2 xs:flex-nowrap'>
        <Link href='/' shallow legacyBehavior>
          <Badge className='whitespace-nowrap cursor-pointer font-normal'>Movie advisor</Badge>
        </Link>
        <DesktopNavigation />
        <div className='flex items-center gap-2'>
          <div id='actions' className='empty:hidden' />
          <ToggleTheme />
          <ToggleSearch />
          <MobileNavigation />
        </div>
      </div>
    </div>
  </header>
);

export default Header;
