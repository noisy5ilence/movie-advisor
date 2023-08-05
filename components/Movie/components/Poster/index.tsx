import { FC } from 'react';
import { ImageOff } from 'lucide-react';
import Image from 'next/image';

interface Props {
  title: string;
  poster: string;
  width: number;
  height: number;
  size: number;
}

const Poster: FC<Props> = ({ title, poster, width, height, size = 250 }) => {
  return (
    <div className='max-w-[300px] h-[450px] w-full rounded-lg overflow-hidden shrink-0 relative m-auto lg:m-0'>
      {poster ? (
        <Image
          className='rounded-lg '
          unoptimized
          height={height}
          width={width}
          src={`https://image.tmdb.org/t/p/w500/${poster}`}
          alt={title}
        />
      ) : (
        <div className={`w-[${width}px] h-[${height}px] flex items-center justify-center rounded-lg border`}>
          <ImageOff size={size} strokeWidth={1} />
        </div>
      )}
    </div>
  );
};

export default Poster;
