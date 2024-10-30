import { FC } from 'react';

import { cn } from '@/lib/utils';

import Handlers from './components/Handlers';

interface Props {
  show: Show;
  onClick?: () => void;
  className?: string;
  lazy?: boolean;
}

const Poster: FC<Props> = ({ show, onClick, className, lazy = true }) => (
  <div className={cn('card-aspect-ratio relative bg-black overflow-hidden rounded-lg text-lg', className)}>
    <div className='flex size-full'>
      <picture>
        <source srcSet={show.poster['1x']} media='(max-resolution: 191dpi)' />
        <source srcSet={show.poster['1x']} media='(max-device-pixel-ratio: 1.99)' />
        <source srcSet={show.poster['1.5x']} media='(min-resolution: 192dpi)' />
        <source srcSet={show.poster['1.5x']} media='(min-device-pixel-ratio: 2)' />
        <img
          className='size-full rounded-lg object-cover md:rounded-none md:rounded-l-lg'
          loading={lazy ? 'lazy' : 'eager'}
          src={show.poster['1x']}
          alt={show.title}
        />
      </picture>
    </div>
    <div className='absolute left-0 top-0 flex size-full flex-col justify-between rounded-md bg-vignette p-2 text-white md:rounded-none md:rounded-l-lg'>
      <Handlers show={show} onClick={onClick} />
    </div>
  </div>
);

export default Poster;
