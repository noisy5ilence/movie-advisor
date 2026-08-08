import { NextResponse } from 'next/server';

import { downloadSubtitle } from '@/data/clients/openSubtitles';
import redis from '@/data/clients/redis';

type SubtitleParams = {
  params: {
    fileId: string;
  };
};

const CACHE_TTL = 60 * 60 * 24 * 30;

export async function GET(_: Request, { params: { fileId } }: SubtitleParams) {
  const id = fileId.replace(/\.vtt$/i, '');

  if (!/^\d+$/.test(id)) {
    return NextResponse.json({ error: 'Invalid subtitle file id' }, { status: 400 });
  }

  const key = `subtitles:${id}`;

  try {
    const cached = await redis?.get<string>(key).catch(() => null);
    const content = cached ?? (await downloadSubtitle(Number(id)));

    if (!cached) await redis?.set(key, content, { ex: CACHE_TTL }).catch(() => null);

    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/vtt; charset=utf-8',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error) {
    console.error('[subtitles] download', error);
    return NextResponse.json({ error: 'Failed to download subtitle' }, { status: 502 });
  }
}
