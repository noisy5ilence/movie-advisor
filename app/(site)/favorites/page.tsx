import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';

import UsersList from '@/components/UsersLists';
import { session as getSession } from '@/data';
import usersShowsQuery from '@/data/queries/usersShows';
import { TITLE } from '@/env';
import getQueryClient from '@/lib/queryClient';

export const metadata: Metadata = {
  title: `My Favorite Shows - ${TITLE}`,
  description: `View your favorite shows on ${TITLE}. Keep track of films you’ve added and revisit your top picks anytime.`
};

const Favorites = async () => {
  const session = await getSession();
  const queryClient = getQueryClient();

  const list = 'favorite';

  if (session) {
    queryClient.prefetchInfiniteQuery(usersShowsQuery({ showType: 'movie', session, list }));
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UsersList session={session} list={list} label='favorites' />
    </HydrationBoundary>
  );
};

export default Favorites;
