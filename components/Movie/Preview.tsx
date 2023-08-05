import { FC } from 'react';
import { Star, User2 } from 'lucide-react';
import Image from 'next/image';

import useCredits from '@/app/(site)/useCredits';
import Poster from '@/components/Movie/components/Poster';
import Title from '@/components/Movie/components/Title';
import { CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface Props {
  movie?: Movie;
  className?: string;
}

const Preview: FC<Props> = ({ movie, className }) => {
  const { data: credits } = useCredits({ movieId: movie?.id });
  if (!movie) return null;
  return (
    <div className={`p-3 rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>
      <div className='flex flex-col lg:flex-row max-w-[100%] gap-3 overflow-hidden'>
        <Poster
          title={movie.title}
          width={300}
          height={450}
          size={250}
          poster={movie.poster_path}
          className='max-w-[300px]'
        />
        <div className='flex flex-col grow lg:max-w-[calc(100%-(300px+0.75rem))]'>
          <div className='flex'>
            <div className='flex flex-row flex-wrap w-full text-lg font-semibold'>
              <span className='flex w-full items-center'>
                <span className='mr-2 w-full'>
                  <Title title={movie.title} />
                </span>
                {movie.release_date && <span className='ml-auto'>{new Date(movie.release_date).getFullYear()}</span>}
              </span>
              <span className='flex items-center ml-auto gap-1 mt-[-8px]'>
                <Star size={18} />
                <span>{movie.vote_average}</span>
              </span>
            </div>
          </div>
          <Separator className='my-4' />
          <div className='flex flex-col items-start grow justify-between'>
            <p className='leading-7'>{movie.overview}</p>
            {Boolean(credits?.length) && (
              <div className='overflow-auto max-w-[100%] mt-4'>
                <ul className='flex gap-2'>
                  {credits?.map((actor) => (
                    <li
                      key={`${actor.id}_${actor.cast_id}`}
                      title={actor.name}
                      className='p-2 rounded-lg border bg-card text-card-foreground shadow-sm self-end max-w-[150px] w-full shrink-0'
                    >
                      <div className='rounded-lg overflow-hidden'>
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
        </div>
      </div>
    </div>
  );
};

export default Preview;
