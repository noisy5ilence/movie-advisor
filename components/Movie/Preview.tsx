import { FC, useState } from 'react';
import { Play } from 'lucide-react';

import useTrailer from '@/app/(site)/useTrailer';
import Credits from '@/components/Movie/components/Credits';
import Poster from '@/components/Movie/components/Poster';
import Rating from '@/components/Movie/components/Rating';
import Title from '@/components/Movie/components/Title';
import Trailer from '@/components/Movie/components/Trailer';
import { Separator } from '@/components/ui/separator';

interface Props {
  movie?: Movie;
  className?: string;
  onPersonClick?: (id: string) => void;
}

const Preview: FC<Props> = ({ movie, className, onPersonClick }) => {
  const [isShowTrailer, setIsShowTrailer] = useState(false);
  const { data: trailer } = useTrailer({ movieId: movie?.id });

  if (!movie) return null;

  return (
    <>
      <div className={`p-3 rounded-xl border bg-card text-card-foreground shadow-sm ${className}`}>
        <div className='flex flex-col lg:flex-row max-w-[100%] gap-3 overflow-hidden'>
          <Poster
            className='max-w-[300px]'
            title={movie.title}
            width={300}
            height={450}
            size={100}
            poster={movie.poster_path}
          >
            {trailer && (
              <div
                onClick={() => setIsShowTrailer(true)}
                title='Play trailer'
                className='absolute w-full h-full left-0 top-0 bg-black cursor-pointer overflow-hidden rounded-lg transition-opacity opacity-0 hover:opacity-70 flex items-center justify-center'
              >
                <Play size={100} className='fill-white' />
              </div>
            )}
          </Poster>
          <div className='flex flex-col grow'>
            <div className='flex'>
              <div className='flex flex-row flex-wrap w-full text-lg font-semibold'>
                <span className='flex w-full items-center'>
                  <span className='mr-2 w-full'>
                    <Title title={movie.title} />
                  </span>
                  {movie.release_date && <span className='ml-auto'>{new Date(movie.release_date).getFullYear()}</span>}
                </span>
                <Rating movie={movie} />
              </div>
            </div>
            <Separator className='my-2' />
            <div className='flex flex-col items-start grow justify-between'>
              <p className='leading-7'>{movie.overview}</p>
            </div>
          </div>
        </div>
        <Credits movieId={movie.id} onPersonClick={onPersonClick} />
      </div>
      {isShowTrailer && <Trailer trailerKey={trailer?.key} onClose={() => setIsShowTrailer(false)} />}
    </>
  );
};

export default Preview;
