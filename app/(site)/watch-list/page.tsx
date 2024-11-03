import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
import { cookies } from 'next/headers';

import UsersList from '@/components/UsersLists';
import usersShowsQuery from '@/data/queries/usersShows';
import { TITLE } from '@/env';
import getQueryClient from '@/lib/queryClient';

export const metadata: Metadata = {
  title: `My watch list | ${TITLE}`,
  description: `View your favorite shows on ${TITLE}. Keep track of films you’ve added and revisit your top picks anytime.`
};

const WatchList = async () => {
  const session = cookies().get('session')?.value;
  const queryClient = getQueryClient();

  const list = 'watchlist';

  if (session) {
    await queryClient.prefetchInfiniteQuery(usersShowsQuery({ showType: 'movie', session, list }));
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UsersList session={session} list={list} label='watch' />
    </HydrationBoundary>
  );
};

export default WatchList;
