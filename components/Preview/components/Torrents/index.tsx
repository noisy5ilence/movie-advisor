import React, { FC, FormEvent, useState } from 'react';
import { create, InstanceProps } from 'react-modal-promise';
import { DndContext } from '@dnd-kit/core';
import { horizontalListSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TabsContent } from '@radix-ui/react-tabs';
import { Loader } from 'lucide-react';
import { Search } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ButtonsGroup from '@/components/ui/buttons-group';
import { Modal } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sort } from '@/data/parsers';
import { cn } from '@/lib/utils';

import TorrentsTable from './components/TorrentsTable';
import { providers } from './constants';
import useProvidersOrder, { ProviderKey } from './useProvidersOrder';
import useTorrents from './useTorrents';

type Props = InstanceProps<void> & Show & Partial<Details>;

const SortableTabsTrigger: FC<{ provider: (typeof providers)[ProviderKey]; isLoading: boolean }> = ({
  provider,
  isLoading
}) => {
  const { listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: provider.key });

  return (
    <TabsTrigger
      ref={setNodeRef}
      value={provider.key}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn('min-h-8 touch-none', isDragging && 'z-10 opacity-50')}
      {...listeners}
    >
      {isLoading ? <Loader className='animate-spin' size={14} /> : provider.label}
    </TabsTrigger>
  );
};

const showTorrentsModal = create(({ onResolve, ...show }: Props) => {
  const [sort, setSort] = useState<Sort>(Sort.seeds);

  const [manualQuery, setManualQuery] = useState(show.title);
  const [query, setQuery] = useState(manualQuery);

  const year = new Date(show.release).getFullYear();

  // YTS is a movies-only API, so it has nothing to offer for series
  const isSeries = show.type === 'tv';

  const yts = useTorrents({
    query: isSeries ? '' : show.title,
    queryFn: providers.yts.queryFn,
    sort,
    key: providers.yts.key,
    imdbID: show.imdb_id!
  });
  const tpb = useTorrents({
    query,
    queryFn: providers.tpb.queryFn,
    sort,
    key: providers.tpb.key,
    imdbID: show.imdb_id!
  });
  const tlk = useTorrents({
    query,
    queryFn: providers.tlk.queryFn,
    sort,
    key: providers.tlk.key,
    imdbID: show.imdb_id!
  });

  const queries = { yts, tpb, tlk };

  const { order, ...dndProps } = useProvidersOrder();

  const visibleOrder = isSeries ? order.filter((key) => key !== 'yts') : order;

  const tabs = visibleOrder.map((key) => ({ query: queries[key], provider: providers[key] }));

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();

    setQuery(manualQuery);
  };

  const checkIsEmpty = (query: (typeof tabs)[number]['query']) =>
    query.isFetched && !query.isLoading && !query.data?.length;

  return (
    <Modal className='rounded-xl p-0' onClose={onResolve}>
      <form className='p-2' tabIndex={1} onSubmit={handleSearch}>
        <ButtonsGroup className='h-10'>
          <Input
            className='h-full'
            value={manualQuery}
            onChange={({ target: { value } }) => setManualQuery(value)}
            placeholder='Start typing title...'
          />
          <Button
            type='submit'
            className='h-full !px-3 transition-all duration-200 hover:bg-secondary-foreground hover:shadow-lg hover:shadow-secondary-foreground/60'
            disabled={tpb.isPending || tlk.isPending}
          >
            <Search size={16} />
          </Button>
        </ButtonsGroup>
      </form>
      <Tabs defaultValue={tabs[0].provider.key} className='w-full rounded-none px-2'>
        <DndContext {...dndProps}>
          <SortableContext items={visibleOrder} strategy={horizontalListSortingStrategy}>
            <TabsList className={cn('grid w-full', isSeries ? 'grid-cols-2' : 'grid-cols-3')}>
              {tabs.map(({ provider, query }) => (
                <SortableTabsTrigger key={provider.key} provider={provider} isLoading={query.isLoading} />
              ))}
            </TabsList>
          </SortableContext>
        </DndContext>
        {tabs.map(({ provider, query }) => {
          const isEmpty = checkIsEmpty(query);

          return (
            <TabsContent className='pb-1' key={provider.key} value={provider.key}>
              <TorrentsTable
                show={show}
                title={show.title}
                sort={sort}
                sortable={provider.sortable}
                onChangeSort={setSort}
                provider={provider.key}
                torrents={query.data || []}
              />

              {(query.isLoading || query.isFetching) && (
                <div className='flex h-40 w-full items-center justify-center'>
                  <Loader className='animate-spin' />
                </div>
              )}

              {isEmpty && (
                <div className='flex h-40 w-full items-center justify-center text-xl text-muted-foreground'>
                  Nothing was found
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </Modal>
  );
});

export default showTorrentsModal;
