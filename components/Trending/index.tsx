'use client';

import { FC, useState } from 'react';

import Nav from '@/components/ui/nav';

import Gallery from './components/Gallery';
import { tabs } from './constants';
import useTrending from './useTrending';

const Trending: FC = () => {
  const [active, setActive] = useState(tabs[0]);
  const isMobile = typeof window === 'undefined' ? true : matchMedia('(max-width: 600px)').matches;

  const { data: trending, isFetched } = useTrending({ type: 'trending', enabled: !isMobile });
  const { data: streaming } = useTrending({ type: 'streaming', enabled: !isMobile });
  const { data: theater } = useTrending({ type: 'theater', enabled: !isMobile });

  const shows = { trending, streaming, theater }[active.type] || [];

  return (
    isFetched && (
      <div>
        <Nav tabs={tabs} active={active} onChange={(active) => setActive(active)} className='mb-3' />
        <Gallery key={active.type} shows={shows} />
      </div>
    )
  );
};

export default Trending;
