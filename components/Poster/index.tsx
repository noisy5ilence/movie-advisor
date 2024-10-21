import { DetailedHTMLProps, FC, HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

import Handlers from './components/Handlers';

interface Props {
  show?: Show;
  onClick?: () => void;
  className?: string;
  rounded?: string;
  lazy?: boolean;
  containerProps?: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
}

const Poster: FC<Props> = ({ show, onClick, className, rounded, containerProps, lazy = true }) => {
  if (!show) return null;

  return (
    <div
      {...(containerProps || {})}
      className={cn('card-aspect-ratio relative bg-black overflow-hidden rounded-lg text-lg', className, rounded)}
    >
      <div className='flex size-full'>
        <picture>
          <source srcSet={show.poster['1x']} media='(max-resolution: 191dpi)' />
          <source srcSet={show.poster['1x']} media='(max-device-pixel-ratio: 1.99)' />
          <source srcSet={show.poster['1.5x']} media='(min-resolution: 192dpi)' />
          <source srcSet={show.poster['1.5x']} media='(min-device-pixel-ratio: 2)' />
          <img
            className={cn('size-full rounded-lg object-cover', rounded)}
            loading={lazy ? 'lazy' : 'eager'}
            src={show.poster['1x']}
            alt={show.title}
          />
        </picture>
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
