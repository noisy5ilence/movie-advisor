import { ImageResponse } from 'next/og';

import { TITLE } from '@/env';

export const alt = `${TITLE} | Discover Your Next Favorite Movie`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const Image = () =>
  new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 28,
          background: 'linear-gradient(135deg, #09090b 0%, #18181b 60%, #312e38 100%)',
          color: 'white'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 28, fontSize: 96 }}>🍿 {TITLE}</div>
        <div style={{ display: 'flex', fontSize: 38, color: '#a1a1aa' }}>Discover your next favorite movie</div>
      </div>
    ),
    size
  );

export default Image;
