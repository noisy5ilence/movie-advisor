import { ChangeEvent, useRef, useState } from 'react';
import { Search as SearchIcon, XCircle } from 'lucide-react';

import List from '@/components/Movie/List';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import useSearch from './useSearch';

const Search = () => {
  const [isShow, setIsShow] = useState(false);
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
    setIsShow(false);
    handleReset();
  };

  return (
    <>
      <Button variant='outline' size='icon' onClick={() => setIsShow(true)}>
        <SearchIcon />
      </Button>
      {isShow && (
        <Dialog defaultOpen={true} onOpenChange={handleClose}>
          <DialogContent className='block p-3 max-w-[950px]' onClose={() => setIsShow(false)}>
            <div className='relative'>
              <Input
                ref={inputRef}
                autoFocus
                placeholder='Start entering title...'
                value={title}
                onChange={handleChangeTitle}
                className='pr-10'
              />
              <Button
                variant='outline'
                size='icon'
                onClick={handleReset}
                disabled={!query.length}
                className='absolute right-0 top-0'
              >
                <XCircle />
              </Button>
            </div>

            {Boolean(results?.pages.length) && (
              <div className='mt-3'>
                <List
                  pages={results!.pages}
                  fetchNextPage={fetchNextPage}
                  hasNextPage={hasNextPage}
                  withBottomGap={false}
                  onPreviewClose={handleClose}
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default Search;
