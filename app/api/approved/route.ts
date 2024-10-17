import { NextRequest, NextResponse } from 'next/server';

import broadcaster from '@/lib/broadcaster';

export async function GET({ nextUrl }: NextRequest) {
  const requestToken = nextUrl.searchParams.get('request_token');

  broadcaster.emit('approve', requestToken);

  return NextResponse.json({ requestToken });
}
