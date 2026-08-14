'use client';

import { useEffect } from 'react';
import { getInitSnippet } from '@openpanel/web';

import { OPENPANEL_API_URL, OPENPANEL_CLIENT_ID, OPENPANEL_SCRIPT_URL } from '@/env';

const SCRIPT_ID = 'openpanel-sdk';

const SRC = OPENPANEL_SCRIPT_URL || 'https://openpanel.dev/op1.js';

const OPTIONS = {
  clientId: OPENPANEL_CLIENT_ID,
  apiUrl: OPENPANEL_API_URL,
  trackScreenViews: true,
  trackOutgoingLinks: true
};

const Analytics = () => {
  useEffect(() => {
    if (!OPENPANEL_CLIENT_ID) return;

    let cancelled = false;

    const append = () => {
      if (cancelled || document.getElementById(SCRIPT_ID)) return;

      const script = document.createElement('script');

      script.id = SCRIPT_ID;
      script.src = SRC;
      script.async = true;

      document.body.appendChild(script);
    };

    const schedule = () =>
      typeof window.requestIdleCallback === 'function'
        ? window.requestIdleCallback(append, { timeout: 5000 })
        : window.setTimeout(append, 2000);

    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!OPENPANEL_CLIENT_ID) return null;

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `${getInitSnippet()}window.op('init', ${JSON.stringify(OPTIONS)});`
      }}
    />
  );
};

export default Analytics;
