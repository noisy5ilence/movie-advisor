'use client';

import { FC } from 'react';

import List from '@/components/List';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useUsersShows from '@/hooks/useUsersShows';

interface Props {
  list: 'favorite' | 'watchlist';
  label: string;
  session?: string;
}

const UsersList: FC<Props> = ({ list, label, session }) => {
  const movies = useUsersShows({ list, showType: 'movie', session });
  const series = useUsersShows({ list, showType: 'tv', session, mode: 'default' });

  const tabs = [
    { query: movies, title: 'Movies', key: 'movie' as const },
    { query: series, title: 'Series', key: 'tv' as const }
  ];

  return (
    <Tabs defaultValue='movie' className='flex w-full flex-col items-center'>
      <TabsList className='grid w-full grid-cols-2 sm:w-[300px]'>
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
