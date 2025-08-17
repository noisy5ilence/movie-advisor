import { atom, useAtomValue, useSetAtom } from 'jotai';

const canPlayAtom = atom<boolean>(false as boolean);

export const useCanPlay = () => useAtomValue(canPlayAtom);

export const useSetCanPlay = () => useSetAtom(canPlayAtom);
