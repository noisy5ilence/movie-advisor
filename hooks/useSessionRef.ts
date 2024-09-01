import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';

const useSessionRef = <T>(key: string, initialValue: T): [MutableRefObject<T>, (value: T) => void] => {
  const [state] = useState(() => {
    if (typeof window === 'undefined') return initialValue;

    const storedValue = sessionStorage.getItem(key);

    return storedValue ? JSON.parse(storedValue) : initialValue;
  });

  const ref = useRef(state);

  useEffect(() => {
    const listener = () => sessionStorage.removeItem(key);

    window.addEventListener('beforeunload', listener);

    return () => window.removeEventListener('beforeunload', listener);
  }, [key]);

  const setter = useCallback(
    (value: T) => {
      sessionStorage.setItem(key, JSON.stringify(value));
      ref.current = value;
    },
    [key]
  );

  return [ref, setter];
};

export default useSessionRef;
