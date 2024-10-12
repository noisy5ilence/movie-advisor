'use client';

import { Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import useTheme from '@/hooks/useTheme';

const ThemeToggle = () => {
  const [theme, setTheme] = useTheme();

  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      title={`Set ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      {theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
    </Button>
  );
};

export default ThemeToggle;
