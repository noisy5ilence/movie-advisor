import { FC } from 'react';
import { ImageOff } from 'lucide-react';

interface Props {
  title: string;
  poster: string;
}

const Poster: FC<Props> = ({ title, poster }) => {
  return poster ? (
    <img className='size-full rounded-lg object-cover' src={poster} alt={title} />
  ) : (
    <div className='flex w-full grow items-center justify-center rounded-lg'>
      <ImageOff size={100} strokeWidth={1} color='hsl(215.4 16.3% 46.9%)' />
    </div>
  );
};

export default Poster;
