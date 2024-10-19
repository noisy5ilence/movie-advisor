'use client';

import { FC, useState } from 'react';

import Nav from '@/components/ui/nav';

import Gallery from './components/Gallery';
import { tabs } from './constants';
import useTrending from './useTrending';

const Trending: FC = () => {
  const [active, setActive] = useState(tabs[0]);

  const { data: streaming, isFetched } = useTrending({ type: 'streaming' });
  const { data: trending } = useTrending({ type: 'trending' });
  const { data: theater } = useTrending({ type: 'theater' });

  const shows = { trending, streaming, theater }[active.type] || [];

  return (
    isFetched && (
      <div className='hidden md:block'>
        <Nav tabs={tabs} active={active} onChange={(active) => setActive(active)} className='mb-3' />
        <Gallery key={active.type} shows={shows} />
      </div>
    )
  );
};

export default Trending;
