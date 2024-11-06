'use client';

import { FC, useState } from 'react';

import useSimilar from '@/components/Trending/useSimilar';
import Nav from '@/components/ui/nav';

import Gallery from './components/Gallery';
import { tabs as initialTabs } from './constants';
import useTrending from './useTrending';

interface Props {
  showType: Show['type'];
  showId: Show['id'];
  preview?: boolean;
}

const Trending: FC<Props> = ({ showId, showType, preview }) => {
  const tabs = preview ? initialTabs.filter(({ type }) => ['similar', 'recommendations'].includes(type)) : initialTabs;

  const [active, setActive] = useState(tabs[0]);

  const streaming = useTrending({ type: 'streaming', enabled: !preview });
  const trending = useTrending({ type: 'trending', enabled: active.type === 'trending' });
  const theater = useTrending({ type: 'theater', enabled: active.type === 'theater' });
  const similar = useSimilar({
    showId,
    showType,
    type: 'similar',
    enabled: active.type === 'similar'
  });
  const recommendations = useSimilar({
    showId,
    showType,
    type: 'recommendations',
    enabled: active.type === 'recommendations'
  });

  const tab = { trending, streaming, theater, similar, recommendations }[active.type]!;

  return (
    (streaming.isFetched || similar.isFetched) && (
      <div className='hidden md:block'>
        <Nav tabs={tabs} active={active} onChange={(active) => setActive(active)} className='mb-3' />
        {!tab.isPending && <Gallery key={active.type} shows={tab.data || []} />}
      </div>
    )
  );
};

export default Trending;
