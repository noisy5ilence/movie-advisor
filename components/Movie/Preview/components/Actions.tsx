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
      <Button className='h-8 grow' onClick={() => showTorrentsModal({ title: movie.title })}>
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
    </>
  );
}
