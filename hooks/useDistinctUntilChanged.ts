import { useEffect, useRef, useState } from 'react';

function useDistinctUntilChanged<T>(value: T, delayMS: number = 500): T {
  const [distinctValue, setDistinctValue] = useState(value);
  const previousValueRef = useRef(value);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const clear = () => clearTimeout(timeoutRef.current);

    if (previousValueRef.current === value) return clear;

    previousValueRef.current = value;

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => setDistinctValue(value), delayMS);

    return clear;
  }, [value, delayMS]);

  return distinctValue;
}

export default useDistinctUntilChanged;
