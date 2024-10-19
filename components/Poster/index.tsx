import { DetailedHTMLProps, FC, HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

import Handlers from './components/Handlers';

interface Props {
  show?: Show;
  onClick?: () => void;
  className?: string;
  rounded?: string;
  containerProps?: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
}

const Poster: FC<Props> = ({ show, onClick, className, rounded, containerProps }) => {
  if (!show) return null;

  return (
    <div
      {...(containerProps || {})}
      className={cn('card-aspect-ratio relative bg-black overflow-hidden rounded-lg text-lg', className, rounded)}
    >
      <div className='flex size-full'>
        <img className={cn('size-full rounded-lg object-cover', rounded)} src={show.poster} alt={show.title} />
      </div>
      <div
        className={cn(
          'absolute left-0 top-0 flex size-full flex-col justify-between rounded-md bg-vignette p-2 text-white',
          rounded
        )}
      >
        <Handlers show={show} onClick={onClick} />
      </div>
    </div>
  );
};

export default Poster;
