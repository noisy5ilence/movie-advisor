import { useLayoutEffect, useState } from 'react';

export default function useMounted() {
  const [isMounted, setIsMounted] = useState(false);

  useLayoutEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}
