import { useLayoutEffect, useState } from 'react';

const useMounted = () => {
  const [isMounted, setIsMounted] = useState(false);

  useLayoutEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
};

export default useMounted;
