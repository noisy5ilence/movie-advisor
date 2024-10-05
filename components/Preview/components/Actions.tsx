'use client';

import Link from 'next/link';

import showTorrentsModal from '@/components/Show/components/Torrents';
import ToggleTrailer from '@/components/Show/components/Trailer';
import { Button } from '@/components/ui/button';

interface Props {
  show: Show;
  onClose?: () => void;
}

const Actions = ({ onClose, show }: Props) => (
  <>
    <ToggleTrailer showType={show.type} showId={show.id}>
      {({ onPlay, disabled }) => (
        <Button className='h-8 w-1/2 grow' onClick={onPlay} disabled={disabled}>
          Trailer
        </Button>
      )}
    </ToggleTrailer>
    <Button
      className='h-8 w-1/2 grow'
      onClick={() =>
        showTorrentsModal({
          showId: show.id,
          showType: show.type,
          title: show.title,
          backdrop: show.backdrop,
          year: new Date(show.release).getFullYear()
        })
      }
    >
      Torrents
    </Button>
    <Link
      className='flex w-1/2'
      href={`/similar?id=${show.id}&title=${encodeURIComponent(show.title)}&type=${show.type}`}
      onClick={onClose}
    >
      <Button className='h-8 grow'>Similar</Button>
    </Link>
  </>
);

export default Actions;
