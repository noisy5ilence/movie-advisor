import { FC } from 'react';
import { User2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import useCredits from '@/app/(site)/useCredits';

interface Props {
  movieId: number;
  onPersonClick?: (id: string) => void;
}

const Credits: FC<Props> = ({ movieId, onPersonClick }) => {
  const router = useRouter();
  const { data: credits } = useCredits({ movieId });

  return (
    Boolean(credits?.length) && (
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
    )
  );
};

export default Credits;
