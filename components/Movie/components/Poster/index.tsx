import { FC } from 'react';
import { ImageOff } from 'lucide-react';

interface Props {
  title: string;
  poster: string;
  size: number;
}

const Poster: FC<Props> = ({ title, poster, size = 250 }) => {
  return poster ? (
    <img
      className='rounded-lg w-full h-full object-fill'
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
