import React, { useState } from 'react';
import { create, InstanceProps } from 'react-modal-promise';
import { TabsContent } from '@radix-ui/react-tabs';
import { Loader } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sort } from '@/data/parsers';

import TorrentsTable from './components/TorrentsTable';
import { providers } from './constants';
import useTorrents from './useTorrents';

interface Props extends InstanceProps<void> {
  imdbID: string;
  title: string;
  year: number;
  backdrop: string;
}

const showTorrentsModal = create(({ title, year, imdbID, backdrop, onResolve }: Props) => {
  const [sort, setSort] = useState<Sort>(Sort.seeds);
  const [withYear, setWithYear] = useState(true);

  const yts = useTorrents({ query: title, queryFn: providers.yts.queryFn, sort, key: providers.yts.key, imdbID });
  const tpb = useTorrents({
    query: withYear ? `${title} ${year}` : title,
    queryFn: providers.tpb.queryFn,
    sort,
    key: providers.tpb.key,
    imdbID
  });
  const tlk = useTorrents({
    query: withYear ? `${title} ${year}` : title,
    queryFn: providers.tlk.queryFn,
    sort,
    key: providers.tlk.key,
    imdbID
  });

  const tabs = [
    {
      query: yts,
      provider: providers.yts
    },
    {
      query: tpb,
      provider: providers.tpb
    },
    {
      query: tlk,
      provider: providers.tlk
    }
  ];

  const checkIsEmpty = (query: (typeof tabs)[number]['query']) =>
    query.isFetched && !query.isLoading && !query.data?.length;

  return (
    <Modal className='rounded-xl p-0' onClose={onResolve}>
      <div className='grid grid-cols-[1fr_auto] items-center gap-3 p-2'>
        <span className='truncate text-base'>{title}</span>
        <Button className='h-6 p-2' variant={withYear ? 'default' : 'ghost'} onClick={() => setWithYear((w) => !w)}>
          {year}
        </Button>
      </div>
      <Tabs defaultValue={providers.yts.key} className='w-full rounded-none'>
        <TabsList className='grid w-full grid-cols-3'>
          {tabs.map(({ provider, query }) => (
            <TabsTrigger key={provider.key} value={provider.key}>
              {query.isLoading ? <Loader className='animate-spin' size={14} /> : provider.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map(({ provider, query }, index) => {
          const isEmpty = checkIsEmpty(query);

          return (
            <TabsContent className='pb-1' key={provider.key} value={provider.key}>
              <TorrentsTable
                year={year}
                title={title}
                backdrop={backdrop}
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
