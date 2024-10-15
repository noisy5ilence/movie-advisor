import React, { useEffect, useRef, useState } from 'react';
import { create, InstanceProps } from 'react-modal-promise';
import { TabsContent } from '@radix-ui/react-tabs';
import { Loader } from 'lucide-react';

import { Sort } from '@/api/parsers';
import { Modal } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const [providerKey, setProviderKey] = useState(providers.yts.key);
  const nextProviderKey = useRef<string | null>(null);

  const yts = useTorrents({ query: title, queryFn: providers.yts.queryFn, sort, key: providers.yts.key, imdbID });
  const tpb = useTorrents({
    query: withYear ? `${title} ${year}` : title,
    queryFn: providers.tpb.queryFn,
    sort,
    key: providers.tpb.key,
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
    }
  ];

  useEffect(() => {
    if (!nextProviderKey.current || providerKey === nextProviderKey.current) return;

    setProviderKey(nextProviderKey.current);
    nextProviderKey.current = null;
  });

  return (
    <Modal className='p-0 pb-1' onClose={onResolve}>
      <Tabs value={providerKey} className='w-full rounded-none'>
        <TabsList className='grid w-full grid-cols-2'>
          {tabs.map(({ provider }) => (
            <TabsTrigger key={provider.key} value={provider.key} onClick={() => setProviderKey(provider.key)}>
              {provider.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map(({ provider, query }, index) => {
          const nextIndex = index + 1;

          const isEmpty = query.isFetched && !query.isLoading && !query.data?.length;

          if (isEmpty && tabs[nextIndex]) {
            nextProviderKey.current = tabs[nextIndex].provider.key;
          }

          return (
            <TabsContent key={provider.key} value={provider.key}>
              <TorrentsTable
                title={title}
                backdrop={backdrop}
                sort={sort}
                sortable={provider.sortable}
                onChangeSort={setSort}
                provider={provider.key}
                torrents={query.data || []}
                year={year}
                withYear={withYear}
                onToggleYear={() => setWithYear((w) => !w)}
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
