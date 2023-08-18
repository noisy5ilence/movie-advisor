import { FC, useState } from 'react';
import { Play } from 'lucide-react';
import { useRouter } from 'next/navigation';

import useTrailer from '@/app/(site)/useTrailer';
import Credits from '@/components/Movie/components/Credits';
import Poster from '@/components/Movie/components/Poster';
import Rating from '@/components/Movie/components/Rating';
import Title from '@/components/Movie/components/Title';
import Trailer from '@/components/Movie/components/Trailer';
import { Separator } from '@/components/ui/separator';

import { Button } from '../ui/button';

import Torrents from './components/Torrents';

interface Props {
  movie?: Movie;
  className?: string;
  onClose?: () => void;
}

const Preview: FC<Props> = ({ movie, className, onClose }) => {
  const [isShowTrailer, setIsShowTrailer] = useState(false);
  const [isShowTorrents, setIsShowTorrents] = useState(false);
  const { data: trailer } = useTrailer({ movieId: movie?.id });
  const router = useRouter();

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
            <div className='flex w-full mt-2 gap-2'>
              <Button className='h-8 grow' onClick={() => setIsShowTorrents(true)}>
                Torrents
              </Button>
              <Button
                className='h-8 grow'
                onClick={() => {
                  router.push(`/top?similar=${movie.id}&title=${encodeURIComponent(movie.title)}`);
                  onClose?.();
                }}
              >
                Similar
              </Button>
            </div>
          </div>
        </div>
        <Credits movieId={movie.id} onPersonClick={() => onClose?.()} />
      </div>
      {isShowTrailer && <Trailer trailerKey={trailer?.key} onClose={() => setIsShowTrailer(false)} />}
      {isShowTorrents && <Torrents title={movie.title} onClose={() => setIsShowTorrents(false)} />}
    </>
  );
};

export default Preview;
