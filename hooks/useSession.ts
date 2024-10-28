import { useCallback } from 'react';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import Cookies from 'js-cookie';

const sessionAtom = atom<string | undefined>(Cookies.get('session') as string);

export const useSession = () => useAtomValue(sessionAtom);

export const useSetSession = () => {
  const setSession = useSetAtom(sessionAtom);

  return useCallback(
    (session: string | undefined) => {
      typeof session === 'string' ? Cookies.set('session', session) : Cookies.remove('session');
      setSession(session);
    },
    [setSession]
  );
};
