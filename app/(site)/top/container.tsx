'use client';

import { FC } from 'react';

import List from '@/components/List';
import NoResults from '@/components/NoResults';

import useTop from './useTop';

const Container: FC<{ type: Show['type'] }> = ({ type }) => {
  const { shows, fetchNextPage, isFetched } = useTop(type);

  if (isFetched && !shows.length) return <NoResults />;

  return <List shows={shows} fetchNextPage={fetchNextPage} />;
};

export default Container;
