'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

import { showTorrentsModal } from '../../components/Torrents';
import ToggleTrailer from '../../components/Trailer';

interface Props {
  movie: Movie;
  onClose?: () => void;
}

export default function Actions({ onClose, movie }: Props) {
  const router = useRouter();

  return (
    <>
      <ToggleTrailer movieId={movie?.id}>
        {({ onPlay, disabled }) => (
          <Button className='h-8 flex-grow w-[50%]' onClick={onPlay} disabled={disabled}>
            Trailer
          </Button>
        )}
      </ToggleTrailer>
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
