'use client';

import { FC, useEffect, useMemo, useState } from 'react';

import useSimilar from '@/components/Trending/useSimilar';
import Nav from '@/components/ui/nav';
import analytics from '@/lib/analytics';

import Gallery from './components/Gallery';
import { seriesTabs, tabs as movieTabs } from './constants';
import useTrending from './useTrending';

interface Props {
  showType: Show['type'];
  showId: Show['id'];
  preview?: boolean;
}

const Trending: FC<Props> = ({ showId, showType, preview }) => {
  const isSeries = showType === 'tv';

  const tabs = useMemo(
    () =>
      (isSeries ? seriesTabs : movieTabs).filter(({ type }) =>
        preview ? ['similar', 'recommendations'].includes(type) : true
      ),
    [isSeries, preview]
  );

  const [active, setActive] = useState(tabs[0]);

  useEffect(() => {
    setActive(tabs[0]);
  }, [tabs]);

  const streaming = useTrending({ type: 'streaming', enabled: !preview && !isSeries });
  const trending = useTrending({ type: 'trending', enabled: active.type === 'trending' });
  const theater = useTrending({ type: 'theater', enabled: active.type === 'theater' });
  const apple = useTrending({ type: 'apple', enabled: isSeries && !preview });
  const netflix = useTrending({ type: 'netflix', enabled: isSeries && active.type === 'netflix' });
  const hbo = useTrending({ type: 'hbo', enabled: isSeries && active.type === 'hbo' });
  const amazon = useTrending({ type: 'amazon', enabled: isSeries && active.type === 'amazon' });
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

  const tab = {
    streaming,
    trending,
    theater,
    apple,
    netflix,
    hbo,
    amazon,
    similar,
    recommendations
  }[active.type]!;

  return (
    (streaming.isFetched || apple.isFetched || similar.isFetched) && (
      <div className='hidden md:block'>
        <Nav
          tabs={tabs}
          active={active}
          onChange={(active) => {
            analytics.galleryTabChanged({ tab: active.type });
            setActive(active);
          }}
          className='mb-3'
        />
        {tab.isFetched && <Gallery key={active.type} shows={tab.shows} onEndReached={tab.fetchNextPage} />}
      </div>
    )
  );
};

export default Trending;
