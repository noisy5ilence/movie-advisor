'use client';

import { FC } from 'react';

import List from '@/components/List';
import NoResults from '@/components/NoResults';

import usePopular from './usePopular';

const Container: FC<{ type: Show['type'] }> = ({ type }) => {
  const { shows, fetchNextPage, isFetched } = usePopular(type);

  if (isFetched && !shows.length) return <NoResults />;

  return <List shows={shows} fetchNextPage={fetchNextPage} />;
};

export default Container;
