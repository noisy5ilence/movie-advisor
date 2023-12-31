import { FC } from 'react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';

import Navigation from './components/Navigation';
import ToggleSearch from './components/Search';
import ToggleTheme from './components/ThemeToggle';

const Header: FC = () => (
  <header className='bg-background sticky pt-[12px] pb-2 top-0 z-10'>
    <div className='flex items-center justify-between'>
      <Link href='/'>
        <Badge className='whitespace-nowrap'>Movie advisor</Badge>
      </Link>
      <div className='flex items-center gap-2'>
        <ToggleTheme />
        <ToggleSearch />
      </div>
    </div>
    <Navigation />
  </header>
);

export default Header;
