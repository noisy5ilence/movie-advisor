import { FC } from 'react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
        <Link shallow href='/'>
          <Badge className='cursor-pointer whitespace-nowrap text-[15px] font-normal leading-[18px]'>
            Movie advisor
          </Badge>
        </Link>
        <DesktopNavigation />
        <div className='flex items-center gap-2'>
          <ToggleTheme />
          <ToggleSearch />
          <User />
          <MobileNavigation />
        </div>
      </div>
    </div>
  </header>
);

export default Header;
