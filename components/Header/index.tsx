import { FC } from 'react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';

import { DesktopNavigation, MobileNavigation } from './components/Navigation';
import ToggleSearch from './components/Search';
import ToggleTheme from './components/ThemeToggle';

const Header: FC = () => (
  <header className='flex justify-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2'>
    <div className='container'>
      <div className='flex items-center justify-between gap-2 xs:flex-nowrap'>
        <Link shallow href='/'>
          <Badge className='whitespace-nowrap cursor-pointer font-normal'>Movie advisor</Badge>
        </Link>
        <DesktopNavigation />
        <div className='flex items-center gap-2'>
          <ToggleTheme />
          <ToggleSearch />
          <MobileNavigation />
        </div>
      </div>
    </div>
  </header>
);

export default Header;
