import { FC } from 'react';

import { cn } from '@/lib/utils';

import Brand from './components/Brand';
import { DesktopNavigation, MobileNavigation } from './components/Navigation';
import ToggleSearch from './components/Search';
import ToggleTheme from './components/ThemeToggle';
import User from './components/User';

interface Props {
  className?: string;
}

const Header: FC<Props> = ({ className }) => (
  <header
    className={cn(
      'flex justify-center bg-background/95 md:py-2 py-1 backdrop-blur supports-[backdrop-filter]:bg-background/60',
      className
    )}
  >
    <div className='container'>
      <div className='flex items-center justify-between gap-2 xs:flex-nowrap'>
        <Brand />
        <DesktopNavigation />
        <div className='flex items-center gap-2'>
          <ToggleSearch />
          <ToggleTheme />
          <User />
          <MobileNavigation />
        </div>
      </div>
    </div>
  </header>
);

export default Header;
