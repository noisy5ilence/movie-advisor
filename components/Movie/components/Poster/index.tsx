import { FC } from 'react';
import { ImageOff } from 'lucide-react';

interface Props {
  title: string;
  poster: string;
}

const Poster: FC<Props> = ({ title, poster }) => {
  return poster ? (
    <img
      className='rounded-lg w-full h-full object-cover'
      src={`https://image.tmdb.org/t/p/w500/${poster}`}
      alt={title}
    />
  ) : (
    <div className='w-full flex items-center justify-center rounded-lg grow'>
      <ImageOff size={100} strokeWidth={1} color='hsl(215.4 16.3% 46.9%)' />
    </div>
  );
};

export default Poster;
