'use client';

import { FC, useState } from 'react';

import Marquee from '@/components/Marquee';
import Nav from '@/components/ui/nav';

import useTrending from './useTrending';

const tabs = [
  {
    title: 'Trending',
    type: 'trending'
  },
  {
    title: 'Streaming',
    type: 'streaming'
  },
  {
    title: 'In theaters',
    type: 'theater'
  }
];

const Trending: FC = () => {
  const [active, setActive] = useState(tabs[0]);
  const isMobile = typeof window === 'undefined' ? true : matchMedia('(max-width: 600px)').matches;

  const { data: trending, isFetched } = useTrending({ type: 'trending', enabled: !isMobile });
  const { data: streaming } = useTrending({ type: 'streaming', enabled: !isMobile });
  const { data: theater } = useTrending({ type: 'theater', enabled: !isMobile });

  const movies = { trending, streaming, theater }[active.type] || [];

  return (
    isFetched && (
      <div>
        <Nav tabs={tabs} active={active} onChange={(active) => setActive(active)} className='mb-3' />
        <Marquee key={active.type} movies={movies} />
      </div>
    )
  );
};

export default Trending;
