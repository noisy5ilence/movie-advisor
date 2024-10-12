'use client';

import List from '@/components/List';
import NoResults from '@/components/NoResults';

import usePopular from './usePopular';

const Container = () => {
  const { shows, fetchNextPage, isFetched } = usePopular();

  if (isFetched && !shows.length) return <NoResults />;

  return <List shows={shows} fetchNextPage={fetchNextPage} />;
};

export default Container;
