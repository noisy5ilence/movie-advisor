import { useEffect, useRef } from 'react';

// Stands in for TypeScript 5.4's NoInfer. Without it the payload widens literal unions such as
// `'page' | 'modal'` to `string` instead of being checked against the emitter's type.
type NoInfer<Type> = [Type][Type extends unknown ? 0 : never];

/**
 * Fires an emitter once per distinct `key`, skipping while it is nullish. Keeps view style
 * events (a show opened, a search resolved) to a single line at the call site instead of an
 * effect plus a ref in every component that needs one.
 */
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

    emit(payloadRef.current());
  }, [emit, key]);
};

export default useTrackOnce;
