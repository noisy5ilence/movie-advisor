import { FC } from 'react';
import { ImageOff } from 'lucide-react';
import Image from 'next/image';

import { cn } from '@/lib/utils';

interface Props {
  title: string;
  poster: string;
  size: number;
  className?: string;
}

const Poster: FC<Props> = ({ title, poster, size = 250, className }) => {
  return poster ? (
    <Image
      className={cn('rounded-lg mx-auto w-auto h-full object-fill', className)}
      unoptimized
      height={750}
      width={500}
      src={`https://image.tmdb.org/t/p/w500/${poster}`}
      alt={title}
    />
  ) : (
    <div className={'w-full flex items-center justify-center rounded-lg grow'}>
      <ImageOff size={size} strokeWidth={1} color='hsl(215.4 16.3% 46.9%)' />
    </div>
  );
};

export default Poster;
