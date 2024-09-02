'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { showTorrentsModal } from '../../components/Torrents';
import ToggleTrailer from '../../components/Trailer';

interface Props {
  movie: Movie;
  onClose?: () => void;
  type?: ShowType;
}

export default function Actions({ onClose, movie, type }: Props) {
  return (
    <>
      <ToggleTrailer type={type} movieId={movie?.id}>
        {({ onPlay, disabled }) => (
          <Button className='h-8 flex-grow w-[50%]' onClick={onPlay} disabled={disabled}>
            Trailer
          </Button>
        )}
      </ToggleTrailer>
      <Button
        className='h-8 flex-grow w-[50%]'
        onClick={() =>
          showTorrentsModal({
            id: movie.id,
            type: type as ShowType,
            title: movie?.name || movie.title,
            year: new Date(movie.first_air_date || movie.release_date).getFullYear()
          })
        }
      >
        Torrents
      </Button>
      <Link
        className='flex w-[50%]'
        href={`/similar?movieId=${movie.id}&title=${encodeURIComponent(movie?.name || movie.title)}&type=${type}`}
        onClick={onClose}
      >
        <Button className='h-8 flex-grow'>Similar</Button>
      </Link>
    </>
  );
}
