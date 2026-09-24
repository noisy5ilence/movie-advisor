import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import JsonLd from '@/components/JsonLd';
import popularQuery from '@/data/queries/popular';
import { itemList } from '@/lib/jsonLd';
import getQueryClient from '@/lib/queryClient';

import Container from './container';

const PopularContent = async ({ type }: { type: Show['type'] }) => {
  const queryClient = getQueryClient();

  const query = popularQuery({ type });

  await queryClient.prefetchInfiniteQuery(query);

  const shows = queryClient
    .getQueryData<{ pages: Pagination<Show>[] }>(query.queryKey)
    ?.pages.flatMap(({ results }) => results);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {Boolean(shows?.length) && <JsonLd data={itemList(shows!)} />}
      <h1 className='sr-only'>{type === 'tv' ? 'Popular Series' : 'Popular Movies'}</h1>
      <Container type={type} />
    </HydrationBoundary>
  );
};

export default PopularContent;
