'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

const ThemeToggle = () => {
  const { setTheme } = useTheme();

  return (
    <>
      <Button
        aria-label='Toggle theme'
        variant='ghost'
        size='icon'
        onClick={() => setTheme('light')}
        className='hidden dark:flex'
        title='Set light theme'
      >
        <Sun size={19} />
      </Button>
      <Button
        aria-label='Toggle theme'
        variant='ghost'
        size='icon'
        onClick={() => setTheme('dark')}
        className='flex dark:hidden'
        title='Set dark theme'
      >
        <Moon size={19} />
      </Button>
    </>
  );
};

export default ThemeToggle;
