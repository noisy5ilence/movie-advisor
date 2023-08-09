import { FC, useState } from 'react';
import { Play, Star, User2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import useFavorites from '@/app/(site)/favorites/useFavorites';
import useCredits from '@/app/(site)/useCredits';
import useTrailer from '@/app/(site)/useTrailer';
import Poster from '@/components/Movie/components/Poster';
import Rating from '@/components/Movie/components/Rating';
import Title from '@/components/Movie/components/Title';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

interface Props {
  movie?: Movie;
  className?: string;
  onPersonClick?: (id: string) => void;
}

const Preview: FC<Props> = ({ movie, className, onPersonClick }) => {
  const { data: credits } = useCredits({ movieId: movie?.id });
  const { data: trailer } = useTrailer({ movieId: movie?.id });

  const [isShowTrailer, setIsShowTrailer] = useState(false);

  const router = useRouter();

  if (!movie) return null;

  return (
    <>
      <div className={`p-3 rounded-xl border bg-card text-card-foreground shadow-sm ${className}`}>
        <div className='flex flex-col lg:flex-row max-w-[100%] gap-3 overflow-hidden'>
          <div className='relative shrink-0'>
            <Poster title={movie.title} width={300} height={350} size={100} poster={movie.poster_path} />
            {trailer && (
              <div
                onClick={() => setIsShowTrailer(true)}
                title='Play trailer'
                className='absolute w-full h-full left-0 top-0 bg-black cursor-pointer overflow-hidden rounded-lg transition-opacity opacity-0 hover:opacity-70 flex items-center justify-center'
              >
                <Play size={100} className='fill-white' />
              </div>
            )}
          </div>
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
        {Boolean(credits?.length) && (
          <div className='overflow-auto max-w-[100%] py-3 mb-[-0.75rem]'>
            <ul className='flex gap-3'>
              {credits?.map((actor) => (
                <li
                  key={`${actor.id}_${actor.cast_id}`}
                  title={actor.name}
                  onClick={() => {
                    router.push(`/top?starring=${actor.id}`);
                    onPersonClick?.(actor.id.toString());
                  }}
                  className='p-2 rounded-lg border bg-card text-card-foreground self-end max-w-[150px] w-full shrink-0 cursor-pointer transition-shadow hover:shadow-lg'
                >
                  {Boolean(actor.character) && (
                    <p className='pb-2 overflow-ellipsis whitespace-nowrap overflow-hidden'>{actor.character}</p>
                  )}
                  <div className='rounded-md overflow-hidden'>
                    {actor.profile_path ? (
                      <Image
                        unoptimized
                        height={225}
                        width={150}
                        src={`https://image.tmdb.org/t/p/w500/${actor.profile_path}`}
                        alt={actor.name}
                      />
                    ) : (
                      <div className='w-[132px] h-[198px] flex items-center justify-center rounded-lg border'>
                        <User2 size={120} strokeWidth={1} />
                      </div>
                    )}
                  </div>
                  <p className='pt-2 overflow-ellipsis whitespace-nowrap overflow-hidden'>{actor.name}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {trailer && isShowTrailer && (
        <Dialog defaultOpen={true} onOpenChange={(isOpen) => !isOpen && setIsShowTrailer(false)}>
          <DialogContent className='block p-0 min-h-[400px] aspect-w-16 aspect-h-9'>
            <iframe
              allow='autoplay'
              className='border-none rounded-lg'
              width='100%'
              height='100%'
              src={`//www.youtube.com/embed/${trailer?.key}?autoplay=1`}
              allowFullScreen
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default Preview;
