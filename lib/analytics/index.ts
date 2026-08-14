import { OPENPANEL_CLIENT_ID } from '@/env';

import type { AnalyticsEvents } from './events';

// The sdk declares `window.op` itself, so this reads it without redeclaring the global.
// It is defined by the inline stub in components/Analytics and queues calls until the real
// script loads, so events fired before then are kept rather than dropped.
const op = () => (window as unknown as { op?: (method: string, ...args: unknown[]) => void }).op;

const ready = () => Boolean(OPENPANEL_CLIENT_ID) && typeof window !== 'undefined';

export const track = <Name extends keyof AnalyticsEvents>(name: Name, properties: AnalyticsEvents[Name]) => {
  if (!ready()) return;

  op()?.('track', name, properties);
};

export const identify = (profileId: string) => {
  if (!ready()) return;

  op()?.('identify', { profileId });
};

export const clearIdentity = () => {
  if (!ready()) return;

  op()?.('clear');
};

export type { AnalyticsEvents, ListName } from './events';
