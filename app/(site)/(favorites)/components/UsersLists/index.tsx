'use client';

import { FC } from 'react';

import List from '@/components/List';
import useUsersShows from '@/hooks/useUsersShows';

interface Props {
  list: 'favorite' | 'watchlist';
  label: string;
  type: Show['type'];
  session?: string;
}

const UsersList: FC<Props> = ({ list, label, type, session }) => {
  const { shows, fetchNextPage, isFetched } = useUsersShows({ list, showType: type, session, mode: 'default' });

  if (isFetched && !shows.length) {
    return (
      <div className='flex h-40 w-full items-center justify-center text-center text-xl text-muted-foreground'>
        There are no {type === 'tv' ? 'series' : 'movies'} in your {label}
      </div>
    );
  }

  return <List shows={shows} fetchNextPage={fetchNextPage} />;
};

export default UsersList;
