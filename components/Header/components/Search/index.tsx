'use client';

import { ChangeEvent, MutableRefObject, useRef, useState } from 'react';
import { create } from 'react-modal-promise';
import { Search as SearchIcon, XCircle } from 'lucide-react';

import List from '@/components/Movie/List';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

import useSearch from './useSearch';

export const showSearchModal = create(({ onResolve }) => {
  const [title, setTitle] = useState('');
  const [query, setQuery] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null) as MutableRefObject<HTMLDivElement>;
  const timeout = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    data: movies,
    hasNextPage: hasNextMoviesPage,
    fetchNextPage: fetchNextMoviesPage
  } = useSearch({ query, type: 'movie' });

  const {
    data: series,
    hasNextPage: hasNextSeriesPage,
    fetchNextPage: fetchNextSeriesPage
  } = useSearch({ query, type: 'tv' });

  const handleChangeTitle = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setTitle(value);

    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setQuery(value.trim()), 500);
  };

  const handleReset = () => {
    setQuery('');
    setTitle('');
    inputRef.current?.focus();
  };

  const handleClose = () => {
    handleReset();
    return onResolve();
  };

  return (
    <Modal className='block p-0 max-w-[932px]' onClose={handleClose} scrollRef={scrollRef}>
      <div className='relative p-2'>
        <Input
          autoFocus
          ref={inputRef}
          placeholder='Start entering title...'
          value={title}
          onChange={handleChangeTitle}
          className='pr-10 focus-visible:ring-0'
        />
        <Button
          variant='outline'
          type='button'
          size='icon'
          onClick={handleReset}
          disabled={!query.length}
          className='absolute right-2 top-2'
        >
          <XCircle />
        </Button>
      </div>
      <Tabs
        defaultValue='movies'
        className={cn('w-full px-2', !(movies?.pages.length && series?.pages?.length) && 'hidden')}
      >
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='movies'>Movies</TabsTrigger>
          <TabsTrigger value='series'>Series</TabsTrigger>
        </TabsList>
        <TabsContent value='movies'>
          {Boolean(movies?.pages.length && movies?.pages?.[0]?.results?.length) && (
            <List
              customScrollParent={scrollRef.current}
              pages={movies!.pages as unknown as MovieDBResponse[]}
              fetchNextPage={fetchNextMoviesPage}
              hasNextPage={hasNextMoviesPage}
              onPreviewClose={handleClose}
              type='movie'
            />
          )}
        </TabsContent>
        <TabsContent value='series'>
          {Boolean(series?.pages.length && series?.pages?.[0]?.results?.length) && (
            <List
              customScrollParent={scrollRef.current}
              pages={series!.pages as unknown as MovieDBResponse[]}
              fetchNextPage={fetchNextSeriesPage}
              hasNextPage={hasNextSeriesPage}
              onPreviewClose={handleClose}
              type='tv'
            />
          )}
        </TabsContent>
      </Tabs>
    </Modal>
  );
});

export default function ToggleSearch() {
  return (
    <Button variant='ghost' size='icon' onClick={() => showSearchModal()}>
      <SearchIcon size={19} />
    </Button>
  );
}
