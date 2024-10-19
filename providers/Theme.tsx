import { createContext, Dispatch, FC, ReactNode, SetStateAction, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export const ThemeContext = createContext<[Theme, Dispatch<SetStateAction<Theme>>]>([
  Cookies.get('theme') as Theme,
  () => null
]);

interface Props {
  children: ReactNode;
  theme?: Theme;
}

const Provider: FC<Props> = ({ children, theme: initialTheme }) => {
  const state = useState<Theme>((Cookies.get('theme') || initialTheme) as Theme);

  const [theme, setTheme] = state;

  useEffect(() => {
    if (!theme) {
      return setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }

    document.documentElement.setAttribute('data-mode', theme);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? 'hsl(222.2 84% 4.9%)' : 'white');
    Cookies.set('theme', theme);
  }, [theme, setTheme]);

  return <ThemeContext.Provider value={state}>{children}</ThemeContext.Provider>;
};

export default Provider;
