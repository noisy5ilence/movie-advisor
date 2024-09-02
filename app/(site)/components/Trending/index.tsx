'use client';

import { FC } from 'react';

import Marquee from '@/components/Marquee';
import { Badge } from '@/components/ui/badge';

import useTrending from './useTrending';

const Trending: FC<{ label: string; type: 'trending' | 'streaming' | 'theater' | 'rent' }> = ({ label, type }) => {
  const isMobile = typeof window === 'undefined' ? true : matchMedia('(max-width: 600px)').matches;
  const { data: movies, isFetched } = useTrending({ type, enabled: !isMobile });

  return (
    isFetched && (
      <>
        <Badge className='mb-2 font-normal'>{label}</Badge>
        <Marquee movies={movies || []} />
      </>
    )
  );
};

export default Trending;
