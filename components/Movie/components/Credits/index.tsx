import { FC, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { User2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import useCredits from '@/app/(site)/useCredits';

interface Props {
  movieId: number;
  onPersonClick?: (id: string) => void;
}

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15
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

const Credits: FC<Props> = ({ movieId, onPersonClick }) => {
  const router = useRouter();
  const { data: credits } = useCredits({ movieId });

  return (
    Boolean(credits?.length) && (
      <div className='overflow-auto max-w-[100%] py-3 mb-[-0.75rem]'>
        <motion.ul className='flex gap-3' variants={container} initial='hidden' animate='visible' whileInView='visible'>
          {credits?.map((actor) => (
            <motion.li
              variants={item}
              key={`${actor.id}_${actor.cast_id}`}
              title={actor.name}
              onTap={() => {
                router.push(`/top?starring=${actor.id}&title=${encodeURIComponent(actor.name)}`);
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
            </motion.li>
          ))}
        </motion.ul>
      </div>
    )
  );
};

export default Credits;
