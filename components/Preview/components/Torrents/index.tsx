import React, { FormEvent, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { create, InstanceProps } from 'react-modal-promise';
import { TabsContent } from '@radix-ui/react-tabs';
import { Loader } from 'lucide-react';
import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import ButtonsGroup from '@/components/ui/buttons-group';
import { Modal } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sort } from '@/data/parsers';

import Player, { PlayerControlRef } from './components/Player';
import TorrentsTable from './components/TorrentsTable';
import { providers } from './constants';
import useTorrents from './useTorrents';

interface Props extends InstanceProps<void> {
  imdbID: string;
  title: string;
  year: number;
  backdrop: string;
}

const showTorrentsModal = create(({ title: initialTitle, year, imdbID, backdrop, onResolve }: Props) => {
  const [sort, setSort] = useState<Sort>(Sort.seeds);

  const initialQuery = `${initialTitle} ${year}`;

  const [title, setTitle] = useState(initialQuery);

  const [query, setQuery] = useState(title);

  const yts = useTorrents({
    query: initialTitle,
    queryFn: providers.yts.queryFn,
    sort,
    key: providers.yts.key,
    imdbID
  });
  const tpb = useTorrents({
    query,
    queryFn: providers.tpb.queryFn,
    sort,
    key: providers.tpb.key,
    imdbID
  });
  const tlk = useTorrents({
    query,
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

  const playerControlRef = useRef() as PlayerControlRef;

  const playerEntryId = useId();

  const playerEntryRef = useRef<HTMLDivElement>(null);

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();

    setQuery(title || initialQuery);
  };

  const checkIsEmpty = (query: (typeof tabs)[number]['query']) =>
    query.isFetched && !query.isLoading && !query.data?.length;

  return (
    <>
      <div className='hidden' ref={playerEntryRef}>
        {createPortal(
          <Player controlRef={playerControlRef} />,
          document.getElementById(playerEntryId) || playerEntryRef.current || document.body
        )}
      </div>
      <Modal className='rounded-xl p-0' onClose={onResolve}>
        <form className='p-2' tabIndex={1} onSubmit={handleSearch}>
          <ButtonsGroup className='h-10'>
            <Input
              className='h-full'
              value={title}
              onChange={({ target }) => setTitle(target.value)}
              placeholder='Start typing title...'
            />
            <Button
              type='submit'
              className='h-full !px-3 transition-all duration-200 hover:bg-secondary-foreground hover:shadow-lg hover:shadow-secondary-foreground/60'
              disabled={initialQuery === title || tpb.isPending || tlk.isPending}
            >
              <Search size={16} />
            </Button>
          </ButtonsGroup>
        </form>
        <Tabs defaultValue={providers.yts.key} className='w-full rounded-none px-2'>
          <TabsList className='grid w-full grid-cols-3'>
            {tabs.map(({ provider, query }) => (
              <TabsTrigger key={provider.key} value={provider.key} className='min-h-8'>
                {query.isLoading ? <Loader className='animate-spin' size={14} /> : provider.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map(({ provider, query }) => {
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
                  playerEntryId={playerEntryId}
                  onPlay={(options) => {
                    if (!playerControlRef.current) return;

                    playerControlRef.current.sample();
                    options.then((options) => playerControlRef.current.play(options));
                  }}
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
    </>
  );
});

export default showTorrentsModal;
