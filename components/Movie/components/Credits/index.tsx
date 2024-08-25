'use client';

import { FC } from 'react';
import { motion } from 'framer-motion';
import { User2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import useCredits from '@/app/(site)/useCredits';

interface Props {
  movieId: number;
  onPersonClick?: (id: string) => void;
  type?: ShowType;
}

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03
    }
  }
};

const item = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1
  }
};

const Credits: FC<Props> = ({ movieId, onPersonClick, type = 'movie' }) => {
  const router = useRouter();
  const { data: credits } = useCredits({ movieId, type });

  return (
    Boolean(credits?.length) && (
      <motion.ul
        className='flex gap-2 no-scrollbar overflow-auto rounded-lg snap-mandatory snap-x'
        variants={container}
        initial='hidden'
        animate='visible'
        whileInView='visible'
      >
        {credits?.map((actor) => (
          <motion.li
            variants={item}
            key={`${actor.id}_${actor.cast_id}`}
            title={actor.name}
            onTap={() => {
              router.push(`/starring?actorId=${actor.id}&title=${encodeURIComponent(actor.name)}`);
              onPersonClick?.(actor.id.toString());
            }}
            className='bg-card text-card-foreground self-end max-w-[120px] w-full shrink-0 cursor-pointer transition-shadow hover:shadow-lg relative snap-start'
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
            <div className='text-white text-sm absolute w-full h-full top-0 left-0 rounded-md flex flex-col justify-between p-2 py-1 card-gradient'>
              <p className=' overflow-ellipsis whitespace-nowrap overflow-hidden'>{actor.name}</p>
              {Boolean(actor.character) && (
                <p className='overflow-ellipsis whitespace-nowrap overflow-hidden'>{actor.character}</p>
              )}
            </div>
          </motion.li>
        ))}
      </motion.ul>
    )
  );
};

export default Credits;
