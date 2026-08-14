import { useEffect, useRef } from 'react';

import type { AnalyticsEvents } from './events';
import { track } from '.';

/**
 * Fires an event once per distinct `key`, skipping while it is nullish. Keeps view style
 * events (a show opened, a search resolved) to a single line at the call site instead of an
 * effect plus a ref in every component that needs one.
 */
const useTrackOnce = <Name extends keyof AnalyticsEvents>(
  name: Name,
  key: string | number | null | undefined,
  payload: () => AnalyticsEvents[Name]
) => {
  const payloadRef = useRef(payload);
  const sentRef = useRef<string | number | null>(null);

  payloadRef.current = payload;

  useEffect(() => {
    if (key == null || sentRef.current === key) return;

    sentRef.current = key;

    track(name, payloadRef.current());
  }, [name, key]);
};

export default useTrackOnce;
