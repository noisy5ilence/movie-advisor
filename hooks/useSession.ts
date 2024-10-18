import { atom, useAtomValue, useSetAtom } from 'jotai';
import Cookies from 'js-cookie';
import { useCallback } from 'react';

const sessionAtom = atom<string | null>(Cookies.get('session') as string);

export const useSession = () => useAtomValue(sessionAtom);

export const useSetSession = () => {
  const setSession = useSetAtom(sessionAtom);

  return useCallback(
    (session: string | null) => {
      typeof session === 'string' ? Cookies.set('session', session) : Cookies.remove('session');
      setSession(session);
    },
    [setSession]
  );
};
