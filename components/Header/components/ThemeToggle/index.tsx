'use client';

import { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    document
      .querySelector('meta[name="theme-color"]')!
      .setAttribute('content', resolvedTheme === 'dark' ? 'hsl(222.2 84% 4.9%)' : 'white');
  }, [resolvedTheme]);

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
