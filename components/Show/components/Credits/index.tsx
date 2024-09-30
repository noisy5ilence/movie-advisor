'use client';

import { FC } from 'react';
import { User2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import useCredits from './useCredits';

interface Props {
  showId: Show['id'];
  showType?: Show['type'];
  onPersonClick?: (id: string) => void;
}

const Credits: FC<Props> = ({ showId, showType = 'movie', onPersonClick }) => {
  const { data: credits } = useCredits({ showId, showType });

  return (
    Boolean(credits?.length) && (
      <ul className='flex gap-2 no-scrollbar overflow-auto rounded-lg snap-mandatory snap-x opacity-0 animate-fade-aside-slide-in'>
        {credits?.map((actor) => (
          <li
            key={`${actor.id}_${actor.cast_id}`}
            title={actor.name}
            className='bg-card text-card-foreground self-end max-w-[120px] w-full shrink-0 cursor-pointer transition-shadow hover:shadow-lg relative snap-start'
          >
            <Link
              href={`/starring?actorId=${actor.id}&title=${encodeURIComponent(actor.name)}`}
              onClick={() => onPersonClick?.(actor.id.toString())}
            >
              <div className='rounded-lg overflow-hidden'>
                {actor.profile_path ? (
                  <Image
                    unoptimized
                    height={180}
                    width={120}
                    src={`https://image.tmdb.org/t/p/w500/${actor.profile_path}`}
                    alt={actor.name}
                  />
                ) : (
                  <div className='h-[180px] w-[120px] flex items-center justify-center rounded-lg'>
                    <User2 size={120} strokeWidth={1} />
                  </div>
                )}
              </div>
              <div className='text-white text-sm absolute w-full h-full top-0 left-0 rounded-md flex flex-col justify-between p-2 py-1 bg-vignette'>
                <p className=' overflow-ellipsis whitespace-nowrap overflow-hidden'>{actor.name}</p>
                {Boolean(actor.character) && (
                  <p className='overflow-ellipsis whitespace-nowrap overflow-hidden'>{actor.character}</p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    )
  );
};

export default Credits;
