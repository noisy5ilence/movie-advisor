'use client';

import List from '@/components/List';
import NoResults from '@/components/NoResults';

import useTop from './useTop';

const Container = () => {
  const { shows, fetchNextPage, isFetched } = useTop();

  if (isFetched && !shows.length) return <NoResults />;

  return <List shows={shows} fetchNextPage={fetchNextPage} />;
};

export default Container;
