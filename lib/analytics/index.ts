import { OPENPANEL_CLIENT_ID } from '@/env';

import type { AnalyticsEvents } from './events';

type Payload = Record<string, unknown>;

type CamelCase<Name extends string> = Name extends `${infer Head}_${infer Tail}`
  ? `${Head}${Capitalize<CamelCase<Tail>>}`
  : Name;

type Emitter<Properties> = [Properties] extends [void] ? () => void : (properties: Properties) => void;

/**
 * One method per entry in the event catalogue, derived from it rather than written out, so the
 * catalogue stays the single place an event is declared. `show_viewed` becomes
 * `analytics.showViewed(...)` and keeps its snake_case name on the wire.
 */
type Analytics = {
  [Name in keyof AnalyticsEvents as CamelCase<Name & string>]: Emitter<AnalyticsEvents[Name]>;
};

// The sdk declares `window.op` itself, so this reads it without redeclaring the global.
// It is defined by the inline stub in components/Analytics and queues calls until the real
// script loads, so events fired before then are kept rather than dropped.
const op = () => (window as unknown as { op?: (method: string, ...args: unknown[]) => void }).op;

const ready = () => Boolean(OPENPANEL_CLIENT_ID) && typeof window !== 'undefined';

const eventName = (method: string) => method.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

// Emitters are cached so `analytics.showViewed` is referentially stable and safe to pass to a
// hook or use as an effect dependency.
const emitters = new Map<string, (properties?: Payload) => void>();

const analytics = new Proxy({} as Analytics, {
  get: (_, method) => {
    if (typeof method !== 'string') return undefined;

    let emitter = emitters.get(method);

    if (!emitter) {
      const name = eventName(method);

      emitter = (properties?: Payload) => {
        if (!ready()) return;

        op()?.('track', name, properties ?? {});
      };

      emitters.set(method, emitter);
    }

    return emitter;
  }
});

export const identify = (profileId: string) => {
  if (!ready()) return;

  op()?.('identify', { profileId });
};

export const clearIdentity = () => {
  if (!ready()) return;

  op()?.('clear');
};

export type { AnalyticsEvents, ListName } from './events';

export default analytics;
