'use client';

import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { create, InstanceProps } from 'react-modal-promise';
import { Search as SearchIcon, XCircle } from 'lucide-react';

import List from '@/components/Movie/List';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import useSearch from './useSearch';

export const showSearchModal = create(({ onResolve }) => {
  const [title, setTitle] = useState('');
  const [query, setQuery] = useState('');
  const timeout = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: results, hasNextPage, fetchNextPage } = useSearch({ query });

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
    <Modal className='block p-0 max-w-[940px]' onClose={handleClose}>
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
          base
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
      {Boolean(results?.pages.length && results?.pages?.[0]?.results?.length) && (
        <div className='px-2'>
          <List
            pages={results!.pages as unknown as MovieDBResponse[]}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            withBottomGap={false}
            onPreviewClose={handleClose}
          />
        </div>
      )}
    </Modal>
  );
});

export default function ToggleSearch() {
  return (
    <Button base variant='ghost' size='icon' onClick={() => showSearchModal()}>
      <SearchIcon size={19} />
    </Button>
  );
}
