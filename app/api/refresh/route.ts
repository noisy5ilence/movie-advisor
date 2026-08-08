import { NextRequest, NextResponse } from 'next/server';

import tlk from '@/data/parsers/tlk';
import { STREAM_URL } from '@/env';

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
