import { NextRequest } from 'next/server';

import broadcaster from '@/lib/broadcaster';

export async function GET(req: NextRequest) {
  const headers = new Headers();

  headers.set('Content-Type', 'text/event-stream');
  headers.set('Cache-Control', 'no-cache');
  headers.set('Connection', 'keep-alive');

  const stream = new ReadableStream({
    start(controller) {
      const emit = (token: string) => {
        controller.enqueue(new TextEncoder().encode(`data: ${token}\n\n`));
      };

      broadcaster.on('approve', emit);

      req.signal.addEventListener('abort', () => {
        broadcaster.off('approve', emit);
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers
  });
}
