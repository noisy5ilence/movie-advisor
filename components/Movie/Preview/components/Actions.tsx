'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

import { showTorrentsModal } from '../../components/Torrents';

interface Props {
  movie: Movie;
  onClose?: () => void;
}

export default function Actions({ onClose, movie }: Props) {
  const router = useRouter();

  return (
    <>
      <Button
        className='h-8 flex-grow w-[50%]'
        onClick={() => showTorrentsModal({ title: movie.title, year: new Date(movie.release_date).getFullYear() })}
      >
        Torrents
      </Button>
      <Button
        className='h-8 flex-grow w-[50%]'
        onClick={() => {
          router.push(`/similar?movieId=${movie.id}&title=${encodeURIComponent(movie.title)}`);
          onClose?.();
        }}
      >
        Similar
      </Button>
    </>
  );
}
