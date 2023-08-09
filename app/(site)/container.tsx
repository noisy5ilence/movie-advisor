'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';

import Movie from '@/components/Movie/Preview';
import { Button } from '@/components/ui/button';

import useRandomMovie from './useRandomMovie';

export default function Container() {
  const { movie, next, previous, hasPrevious } = useRandomMovie();

  return (
    <>
      <div className='gap-2 flex'>
        <Button className='mb-2 p-2' onClick={previous} disabled={!hasPrevious} title='Previous movie'>
          <ArrowLeft size={24} strokeWidth={1} />
        </Button>
        <Button className='w-full mb-2 p-2 grow' onClick={next} title='Next movie'>
          <ArrowRight size={24} strokeWidth={1} />
        </Button>
      </div>

      <Movie key={movie?.id} movie={movie} />
      <div className='w-full h-2' />
    </>
  );
}
