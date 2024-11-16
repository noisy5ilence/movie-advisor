import { useCallback } from 'react';
import { isServer } from '@tanstack/react-query';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import Cookies from 'js-cookie';

const sessionAtom = atom<string | undefined>(
  (isServer ? Cookies.get('session') : localStorage.getItem('session')) as string
);

export const useSession = () => useAtomValue(sessionAtom);

export const useSetSession = () => {
  const setSession = useSetAtom(sessionAtom);

  return useCallback(
    (session: string | undefined) => {
      if (typeof session === 'string') {
        localStorage.setItem('session', session);
        Cookies.set('session', session);
      } else {
        localStorage.removeItem('session');
        Cookies.remove('session');
      }
      setSession(session);
    },
    [setSession]
  );
};
