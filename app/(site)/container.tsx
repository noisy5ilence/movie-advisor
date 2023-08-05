'use client';

import { RefreshCcwDot } from 'lucide-react';

import Movie from '@/components/Movie/Preview';
import { Button } from '@/components/ui/button';

import useRandomMovie from './useRandomMovie';

export default function Container() {
  const { movie, next } = useRandomMovie();

  return (
    <>
      <Button className='w-full mb-2 p-2' onClick={next} title='Next movie'>
        <RefreshCcwDot size={24} strokeWidth={1} />
      </Button>
      <Movie movie={movie} />
    </>
  );
}
