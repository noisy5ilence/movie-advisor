'use client';

import { FC } from 'react';
import { useAtomValue } from 'jotai';

import List from '@/components/List';
import { showTypeAtom } from '@/components/ShowTypeToggle';
import useUsersShows from '@/hooks/useUsersShows';

interface Props {
  list: 'favorite' | 'watchlist';
  label: string;
  session?: string;
}

const UsersList: FC<Props> = ({ list, label, session }) => {
  const showType = useAtomValue(showTypeAtom);
  const { shows, fetchNextPage, isFetched } = useUsersShows({ list, showType, session, mode: 'default' });

  if (isFetched && !shows.length) {
    return (
      <div className='flex h-40 w-full items-center justify-center text-center text-xl text-muted-foreground'>
        There are no {showType === 'tv' ? 'series' : 'movies'} in your {label}
      </div>
    );
  }

  return <List shows={shows} fetchNextPage={fetchNextPage} />;
};

export default UsersList;
