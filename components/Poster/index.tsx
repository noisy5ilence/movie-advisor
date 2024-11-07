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
  <div
    className={cn(
      'card-aspect-ratio relative bg-black overflow-hidden rounded-lg text-lg',
      'after:block after:absolute after:left-0 after:top-0 after:size-full after:bg-vignette',
      className
    )}
  >
    <picture className='size-full rounded-lg object-cover md:rounded-none md:rounded-l-lg'>
      <source srcSet={show.poster['1x']} media='(max-resolution: 191dpi)' />
      <source srcSet={show.poster['1x']} media='(max-device-pixel-ratio: 1.99)' />
      <source srcSet={show.poster['1.5x']} media='(min-resolution: 192dpi)' />
      <source srcSet={show.poster['1.5x']} media='(min-device-pixel-ratio: 2)' />
      <img className='size-full' loading={lazy ? 'lazy' : 'eager'} src={show.poster['1x']} alt={show.title} />
    </picture>
    <Handlers show={show} onClick={onClick} />
  </div>
);

export default Poster;
