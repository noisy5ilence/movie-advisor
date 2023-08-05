import { FC } from 'react';
import { ImageOff } from 'lucide-react';
import Image from 'next/image';

interface Props {
  title: string;
  poster: string;
  width: number;
  height: number;
  size: number;
  className?: string;
}

const Poster: FC<Props> = ({ title, poster, width, height, size = 250, className }) => {
  return (
    <div className={`w-full flex flex-col rounded-lg overflow-hidden shrink-0 lg:m-0 mx-auto relative ${className}`}>
      {poster ? (
        <Image
          className='rounded-lg mx-auto'
          unoptimized
          height={height}
          width={width}
          src={`https://image.tmdb.org/t/p/w500/${poster}`}
          alt={title}
        />
      ) : (
        <div className={`h-[${height}px] w-full flex items-center justify-center rounded-lg border`}>
          <ImageOff size={size} strokeWidth={1} />
        </div>
      )}
    </div>
  );
};

export default Poster;
