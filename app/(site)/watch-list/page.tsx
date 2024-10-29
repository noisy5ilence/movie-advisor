import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';
import { Metadata } from 'next';

import UsersList from '@/components/UsersLists';
import { session as getSession } from '@/data';
import usersShowsQuery from '@/data/queries/usersShows';
import { TITLE } from '@/env';
import getQueryClient from '@/lib/queryClient';

export const metadata: Metadata = {
  title: `My watch list - ${TITLE}`,
  description: `View your favorite shows on ${TITLE}. Keep track of films you’ve added and revisit your top picks anytime.`
};

const WatchList = async () => {
  const session = await getSession();
  const queryClient = getQueryClient();

  const list = 'watchlist';
  const showType = 'movie';

  if (session) {
    queryClient.prefetchInfiniteQuery(usersShowsQuery({ showType, list, session }));
  }

  return (
    <ReactQueryStreamedHydration>
      <UsersList session={session} list={list} label='watch' />
    </ReactQueryStreamedHydration>
  );
};

export default WatchList;
