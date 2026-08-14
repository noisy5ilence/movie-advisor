import { useEffect, useRef } from 'react';

type NoInfer<Type> = [Type][Type extends unknown ? 0 : never];

const useTrackOnce = <Properties>(
  emit: (properties: Properties) => void,
  key: string | number | null | undefined,
  payload: () => NoInfer<Properties>
) => {
  const payloadRef = useRef(payload);
  const sentRef = useRef<string | number | null>(null);

  payloadRef.current = payload;

  useEffect(() => {
    if (key == null || sentRef.current === key) return;

    sentRef.current = key;

    emit(payloadRef.current() as Properties);
  }, [emit, key]);
};

export default useTrackOnce;
