'use client';

import { FC } from 'react';

import List from '@/components/List';
import useMounted from '@/hooks/useMounted';
import useUsersShows from '@/hooks/useUsersShows';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface Props {
  list: 'favorite' | 'watchlist';
  label: string;
}

const UsersList: FC<Props> = ({ list, label }) => {
  const isMounted = useMounted();

  const movies = useUsersShows({ list, showType: 'movie' });
  const series = useUsersShows({ list, showType: 'tv' });

  const tabs = [
    { query: movies, title: 'Movies', key: 'movie' as const },
    { query: series, title: 'Series', key: 'tv' as const }
  ];

  if (!isMounted) return null;

  return (
    <Tabs defaultValue='movie' className='flex w-full flex-col items-center'>
      <TabsList className='grid w-[300px] grid-cols-2'>
        {tabs.map(({ title, key }) => (
          <TabsTrigger key={key} value={key}>
            {title}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map(({ query, key, title }) => (
        <TabsContent key={key} value={key} className='w-full'>
          {query.isFetched && !query.shows.length ? (
            <div className='flex h-40 w-full items-center justify-center text-center text-xl text-muted-foreground'>
              There are no {title.toLowerCase()} in your {label} list
            </div>
          ) : (
            <List shows={query.shows} fetchNextPage={query.fetchNextPage} />
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default UsersList;
