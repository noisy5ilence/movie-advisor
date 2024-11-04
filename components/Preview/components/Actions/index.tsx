'use client';

import { Bookmark, Copy, Heart, Play, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import ButtonsGroup from '@/components/ui/buttons-group';
import useShowState, { useMutateShowState } from '@/hooks/useShowState';
import { cn } from '@/lib/utils';

interface Props {
  show: Show & Partial<Details>;
  className: string;
  onClose?: () => void;
}

const Actions = ({ onClose, show, className }: Props) => {
  const router = useRouter();

  const state = useShowState({ showId: show.id, showType: show.type });
  const toggle = useMutateShowState(show);

  return (
    <div className={cn('flex gap-2 flex-wrap md:flex-grow-0 flex-grow', className)}>
      <ButtonsGroup className='pointer-events-none'>
        <Button aria-label='Show rating' variant='outline'>
          <Star size={14} />
        </Button>
        <Button variant='outline'>{show.rating.toFixed(1)}</Button>
      </ButtonsGroup>
      <ButtonsGroup>
        <Button
          aria-label='Toggle favorite'
          variant='outline'
          disabled={toggle.list === 'favorite' && toggle.isPending}
          onClick={() => toggle.mutate({ list: 'favorite', value: !state?.favorite })}
        >
          <Heart size={14} className={cn({ 'fill-secondary-foreground': state?.favorite })} />
        </Button>
        <Button
          aria-label='Toggle watch list'
          variant='outline'
          disabled={toggle.list === 'watchlist' && toggle.isPending}
          onClick={() => toggle.mutate({ list: 'watchlist', value: !state?.watchlist })}
        >
          <Bookmark size={14} className={cn({ 'fill-secondary-foreground': state?.watchlist })} />
        </Button>
      </ButtonsGroup>
      <ButtonsGroup>
        <Button
          onClick={() => {
            onClose?.();
            router.push(`/similar?id=${show.id}&title=${encodeURIComponent(show.title)}&type=${show.type}`);
          }}
          aria-label='Similar show'
          variant='outline'
        >
          <Copy size={14} />
          Similar
        </Button>
        <Button
          aria-label='Watch'
          className='bg-red-600 transition-all duration-200 hover:bg-red-600 hover:shadow-lg hover:shadow-red-600/60 dark:bg-red-700'
          variant='destructive'
          onClick={async () => {
            const showTorrentsModal = (await import('../Torrents')).default;

            showTorrentsModal({
              imdbID: show.imdb_id!,
              title: show.title,
              backdrop: show.backdrop,
              year: new Date(show.release).getFullYear()
            });
          }}
        >
          <Play size={15} />
          Watch
        </Button>
      </ButtonsGroup>
    </div>
  );
};

export default Actions;
