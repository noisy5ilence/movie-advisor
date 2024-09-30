import { DetailedHTMLProps, FC, HTMLAttributes } from 'react';

import Poster from '@/components/Show/components/Poster';
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
      <div className='flex w-full h-full'>
        <Poster title={show.title} poster={show.poster} />
      </div>
      <div className='text-white absolute w-full h-full top-0 left-0 rounded-md flex flex-col justify-between p-2 bg-vignette'>
        <Handlers show={show} onClick={onClick} />
        <div className='grid grid-cols-[1fr_auto] opacity-75 gap-2'>
          <span className='overflow-ellipsis overflow-hidden whitespace-nowrap'>{show.title}</span>
          {Boolean(show.release) && <span>{new Date(show.release).getFullYear()}</span>}
        </div>
        <div className='opacity-75 mb-[-5px]'>
          <span className='select-none flex w-full items-center ml-auto gap-1 mt-[-8px] justify-between z-[1]'>
            <Favorite show={show} />
            <Rating rating={show.rating} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Show;
