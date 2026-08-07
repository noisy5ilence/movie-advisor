import { NextRequest, NextResponse } from 'next/server';

import tlk from '@/data/parsers/tlk';
import { STREAM_URL } from '@/env';

// Public proxy the TV calls to re-pull a Toloka thread's CURRENT magnet.
// Given a Toloka topic/thread id (the `id` in download.php?id=<id>), it
// re-downloads the thread's .torrent server-side (auth handled by the Toloka
// client) and returns a fresh magnet + the derived stream m3u. The TV holds
// only the numeric id — never Toloka's authenticated URL.
export async function GET({ nextUrl: { searchParams } }: NextRequest) {
  const tid = searchParams.get('tid');

  if (!tid || !/^\d+$/.test(tid)) {
    return NextResponse.json({ error: 'tid required' }, { status: 400 });
  }

  try {
    const magnet = await tlk.magnet(`download.php?id=${tid}`);
    const [, infoHash] = magnet.match(/btih:([a-z0-9]+)/i) || [];

    return NextResponse.json({
      infoHash: infoHash?.toLowerCase() ?? null,
      magnet,
      m3u: `${STREAM_URL}/stream?m3u&link=${magnet}`
    });
  } catch (_) {
    return NextResponse.error();
  }
}
