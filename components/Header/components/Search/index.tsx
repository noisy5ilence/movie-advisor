'use client';

import { ChangeEvent, MutableRefObject, useRef, useState } from 'react';
import { create } from 'react-modal-promise';
import { Search as SearchIcon, XCircle } from 'lucide-react';

import List from '@/components/List';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useDistinctUntilChanged from '@/hooks/useDistinctUntilChanged';

import useSearch from './useSearch';

export const showSearchModal = create(({ onResolve }) => {
  const [title, setTitle] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null) as MutableRefObject<HTMLDivElement>;
  const inputRef = useRef<HTMLInputElement>(null);
  const isFetchedRef = useRef(false);

  const query = useDistinctUntilChanged(title);

  const movies = useSearch({ query, type: 'movie' });
  const series = useSearch({ query, type: 'tv' });

  const handleChangeTitle = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => setTitle(value);

  const handleReset = () => {
    setTitle('');
    inputRef.current?.focus();
  };

  const tabs = [
    { title: 'Movies', data: movies, type: 'movie' as const },
    { title: 'Series', data: series, type: 'tv' as const }
  ].filter(({ data: { shows } }) => shows.length);

  if (!isFetchedRef.current && movies.isFetched && series.isFetched) {
    isFetchedRef.current = true;
  }

  if (!query) {
    isFetchedRef.current = false;
  }

  return (
    <Modal className='block max-w-[932px] p-0' onClose={onResolve} scrollRef={scrollRef}>
      <div className='relative p-2'>
        <Input
          autoFocus
          ref={inputRef}
          placeholder='Start typing title...'
          value={title}
          onChange={handleChangeTitle}
          className='pr-10 focus-visible:ring-0'
        />
        <Button
          variant='outline'
          type='button'
          size='icon'
          onClick={handleReset}
          disabled={!title.length}
          className='absolute right-2 top-2'
        >
          <XCircle />
        </Button>
      </div>
      {isFetchedRef.current && (
        <div className='px-2'>
          {tabs.length > 1 ? (
            <Tabs defaultValue='movie'>
              <TabsList className='grid w-full grid-cols-2'>
                {tabs.map(({ type, title }) => (
                  <TabsTrigger key={type} value={type}>
                    {title}
                  </TabsTrigger>
                ))}
              </TabsList>
              {tabs.map(({ data: { shows, fetchNextPage }, type }) => (
                <TabsContent value={type} key={type}>
                  <List
                    shows={shows}
                    customScrollParent={scrollRef.current}
                    fetchNextPage={fetchNextPage}
                    onPreviewClose={onResolve}
                  />
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            tabs.map(({ data: { shows, fetchNextPage }, type }) => (
              <List
                key={type}
                shows={shows}
                customScrollParent={scrollRef.current}
                fetchNextPage={fetchNextPage}
                onPreviewClose={onResolve}
              />
            ))
          )}
        </div>
      )}
    </Modal>
  );
});

const ToggleSearch = () => (
  <Button variant='ghost' size='icon' onClick={() => showSearchModal()}>
    <SearchIcon size={19} />
  </Button>
);

export default ToggleSearch;
