'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';

import Movie from '@/components/Movie/Preview';
import { Button } from '@/components/ui/button';

import useRandomMovie from './useRandomMovie';

export default function Container() {
  const { movie, next, previous, hasPrevious } = useRandomMovie();

  return (
    <>
      <div className='gap-2 flex bg-background mb-2 lg:static max-sm:z-10 max-sm:fixed max-sm:bottom-0 max-sm:left-0 max-sm:w-full max-sm:p-2 max-sm:mb-0'>
        <Button className='p-2' onClick={previous} disabled={!hasPrevious} title='Previous movie'>
          <ArrowLeft size={24} strokeWidth={1} />
        </Button>
        <Button className='w-full p-2 grow' onClick={next} title='Next movie'>
          <ArrowRight size={24} strokeWidth={1} />
        </Button>
      </div>
      <Movie key={movie?.id} movie={movie} />
      <div className='w-full h-2' />
    </>
  );
}
