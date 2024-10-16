import { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import Image from 'next/image';

import Rating from '@/components/Show/components/Rating';
import { cn } from '@/lib/utils';

import Favorite from './components/Favorite';
import Handlers from './components/Handlers';

interface Props {
  show?: Show;
  onClick?: () => void;
  className?: string;
  containerProps?: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
}

const Show: FC<Props> = ({ show, onClick, className, containerProps }) => {
  if (!show) return null;

  return (
    <div
      {...(containerProps || {})}
      className={cn(
        'card-aspect-ratio relative bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-lg overflow-hidden rounded-lg text-lg',
        className
      )}
    >
      <div className='flex size-full'>
        <Image unoptimized className='size-full rounded-lg object-cover' fill src={show.poster} alt={show.title} />
      </div>
      <div className='absolute left-0 top-0 flex size-full flex-col justify-between rounded-md bg-vignette p-2 text-white'>
        <Handlers show={show} onClick={onClick} />
        <div className='grid grid-cols-[1fr_auto] gap-2 opacity-75'>
          <span className='truncate'>{show.title}</span>
          {Boolean(show.release) && <span>{new Date(show.release).getFullYear()}</span>}
        </div>
        <div className='mb-[-5px] opacity-75'>
          <span className='z-[1] ml-auto mt-[-8px] flex w-full select-none items-center justify-between gap-1'>
            <Favorite show={show} />
            <Rating rating={show.rating} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Show;
