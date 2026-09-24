'use client';

import { ChangeEvent, MutableRefObject, useRef, useState } from 'react';
import { create } from 'react-modal-promise';
import { Search as SearchIcon, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

import List from '@/components/List';
import { Button } from '@/components/ui/button';
import ButtonsGroup from '@/components/ui/buttons-group';
import { Modal } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import useDistinctUntilChanged from '@/hooks/useDistinctUntilChanged';
import { showTypeFromPath } from '@/lib/showType';

import useSearch from './useSearch';

export const showSearchModal = create(({ onResolve }) => {
  const [title, setTitle] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null) as MutableRefObject<HTMLDivElement>;
  const inputRef = useRef<HTMLInputElement>(null);
  const isFetchedRef = useRef(false);
  const showType = showTypeFromPath(usePathname());

  const query = useDistinctUntilChanged(title);
  const settledTitle = useDistinctUntilChanged(title, 1000);
  const settled = title === settledTitle;

  const search = useSearch({ query, type: showType, settled });

  const handleChangeTitle = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => setTitle(value);

  const handleReset = () => {
    setTitle('');
    inputRef.current?.focus();
  };

  if (!isFetchedRef.current && search.isFetched) {
    isFetchedRef.current = true;
  }

  if (!query) {
    isFetchedRef.current = false;
  }

  return (
    <Modal className='block max-w-[932px] p-0' onClose={onResolve} scrollRef={scrollRef}>
      <div className='sticky top-[-2px] z-20 rounded-xl bg-background p-2'>
        <ButtonsGroup className='h-10'>
          <Input
            autoFocus
            className='h-full'
            ref={inputRef}
            placeholder='Start typing title...'
            value={title}
            onChange={handleChangeTitle}
          />
          <Button
            type='button'
            className='h-full !px-3 transition-all duration-200 hover:bg-secondary-foreground hover:shadow-lg hover:shadow-secondary-foreground/60'
            onClick={handleReset}
            disabled={!title.length}
          >
            <X size={16} />
          </Button>
        </ButtonsGroup>
      </div>
      {isFetchedRef.current && search.shows.length > 0 && (
        <div className='px-2'>
          <List
            shows={search.shows}
            customScrollParent={scrollRef.current}
            fetchNextPage={search.fetchNextPage}
            onPreviewClose={onResolve}
          />
        </div>
      )}
    </Modal>
  );
});

const ToggleSearch = () => (
  <Button aria-label='Search show' variant='ghost' size='icon' onClick={() => showSearchModal()}>
    <SearchIcon size={19} />
  </Button>
);

export default ToggleSearch;
