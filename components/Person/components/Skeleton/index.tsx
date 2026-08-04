import { FC } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const PARAGRAPHS = [
  ['w-full', 'w-full', 'w-10/12'],
  ['w-full', 'w-full', 'w-full', 'w-4/5'],
  ['w-full', 'w-full', 'w-3/4'],
  ['w-full', 'w-2/3']
];

const POSTERS = Array.from({ length: 8 }, (_, index) => index);

const PersonSkeleton: FC = () => (
  <div className='flex flex-1 flex-col'>
    <div className='flex flex-col gap-2 md:flex-row'>
      <Skeleton className='card-aspect-ratio static-aspect-ratio mx-auto rounded-lg' />

      <div className='flex grow flex-col'>
        <Skeleton className='mb-4 h-9 w-72 max-w-full' />

        <div className='mb-4 flex w-full flex-wrap gap-5'>
          <Skeleton className='h-5 w-20' />
          <Skeleton className='h-5 w-28' />
          <Skeleton className='h-5 w-56 max-w-full' />
        </div>

        <div className='flex grow flex-col gap-5 overflow-hidden md:min-h-0'>
          {PARAGRAPHS.map((lines, paragraph) => (
            <div key={paragraph} className='flex shrink-0 flex-col gap-2'>
              {lines.map((width, line) => (
                <Skeleton key={line} className={cn('h-4', width)} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className='mt-5'>
      <Skeleton className='mb-3 h-7 w-36' />
      <div className='flex flex-wrap justify-center gap-2'>
        {POSTERS.map((index) => (
          <Skeleton key={index} className={cn('card-aspect-ratio rounded-lg', { 'hidden md:block': index >= 2 })} />
        ))}
      </div>
    </div>
  </div>
);

export default PersonSkeleton;
