'use client';

import { FC } from 'react';
import { User2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import ScrollNavigation from '@/components/ScrollNavigation';

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
      <ScrollNavigation<HTMLUListElement>>
        {(setRef) => (
          <ul
            ref={setRef}
            className='no-scrollbar flex animate-fade-aside-slide-in snap-x snap-mandatory gap-2 overflow-auto rounded-lg opacity-0'
          >
            {credits?.map((actor) => (
              <li
                key={`${actor.id}_${actor.cast_id}`}
                title={actor.name}
                className='relative w-full max-w-[120px] shrink-0 cursor-pointer snap-start self-end bg-card text-card-foreground transition-shadow hover:shadow-lg'
              >
                <Link
                  href={`/starring?actorId=${actor.id}&title=${encodeURIComponent(actor.name)}`}
                  onClick={() => onPersonClick?.(actor.id.toString())}
                >
                  <div className='overflow-hidden rounded-lg'>
                    <img height={180} width={120} src={actor.photoUrl} alt={actor.name} />
                  </div>
                  <div className='absolute left-0 top-0 flex size-full flex-col justify-between rounded-md bg-vignette p-2 py-1 text-sm text-white'>
                    <p className=' truncate'>{actor.name}</p>
                    {Boolean(actor.character) && <p className='truncate'>{actor.character}</p>}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </ScrollNavigation>
    )
  );
};

export default Credits;
