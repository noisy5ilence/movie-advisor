'use client';
import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import { Loader, Search } from 'lucide-react';

import List from '@/components/Movie/List';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import useSearch from './useSearch';
import useSuggestions from './useSuggestions';

export default function Container() {
  const [title, setTitle] = useState('');
  const [query, setQuery] = useState('');
  const [description, setDescription] = useState('');
  const timeout = useRef<NodeJS.Timeout>();

  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);

  const handleChangeTitle = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setTitle(value);

    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setQuery(value.trim()), 300);
  };

  const { data: results, hasNextPage, fetchNextPage } = useSearch({ query });

  const { data: suggestions, isLoading } = useSuggestions({ description });

  const handleSearchByDescription = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDescription(descriptionRef.current?.value || '');
  };

  return (
    <>
      <Tabs defaultValue='title' className='mb-2'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger
            value='title'
            onClick={() => {
              setDescription('');
              titleRef.current?.focus();
            }}
          >
            by title
          </TabsTrigger>
          <TabsTrigger
            value='description'
            onClick={() => {
              setTitle('');
              setQuery('');
              descriptionRef.current?.focus();
            }}
          >
            by description
          </TabsTrigger>
        </TabsList>
        <TabsContent value='title'>
          <Input
            ref={titleRef}
            autoFocus
            placeholder='Start entering title...'
            value={title}
            onChange={handleChangeTitle}
          />
        </TabsContent>
        <TabsContent value='description'>
          <form onSubmit={handleSearchByDescription} className='flex items-stretch gap-2'>
            <Input ref={descriptionRef} placeholder='Describe movie which you want to watch...' name='description' />
            <Button type='submit' className='h-auto pe-3 ps-3' disabled={isLoading} title='Search'>
              {isLoading ? <Loader className='animate-spin' /> : <Search />}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
      <List
        pages={results?.pages || suggestions?.pages || []}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
      />
    </>
  );
}
