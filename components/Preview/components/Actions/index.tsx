'use client';

import { Bookmark, Copy, Heart, Play, Star } from 'lucide-react';
import Link from 'next/link';

import showTorrentsModal from '@/components/Preview/components/Torrents';
import { Button } from '@/components/ui/button';
import useShowState, { useMutateShowState } from '@/hooks/useShowState';
import { cn } from '@/lib/utils';

interface Props {
  show: Show & Partial<Details>;
  className: string;
  onClose?: () => void;
}

const Actions = ({ onClose, show, className }: Props) => {
  const state = useShowState({ showId: show.id, showType: show.type });
  const toggle = useMutateShowState(show);

  const groupClassName = 'flex bg-input gap-[1px] rounded-md md:flex-grow-0 flex-grow';
  const leftClassName = 'h-8 gap-1 flex-grow border-r-0 rounded-none rounded-l-md md:px-3 px-2';
  const rightClassName = 'h-8 gap-1 flex-grow border-l-0 rounded-none rounded-r-md md:px-3 px-2';

  return (
    <div className={cn('flex gap-2 flex-wrap md:flex-grow-0 flex-grow', className)}>
      <div className={cn(groupClassName, 'pointer-events-none')}>
        <Button className={leftClassName} variant='outline'>
          <Star size={14} />
        </Button>
        <Button className={rightClassName} variant='outline'>
          {show.rating.toFixed(1)}
        </Button>
      </div>
      <div className={groupClassName}>
        <Button
          className={leftClassName}
          variant='outline'
          disabled={toggle.list === 'favorite' && toggle.isPending}
          onClick={() => toggle.mutate({ list: 'favorite', value: !state?.favorite })}
        >
          <Heart size={14} className={cn({ 'fill-secondary-foreground': state?.favorite })} />
        </Button>
        <Button
          className={rightClassName}
          variant='outline'
          disabled={toggle.list === 'watchlist' && toggle.isPending}
          onClick={() => toggle.mutate({ list: 'watchlist', value: !state?.watchlist })}
        >
          <Bookmark size={14} className={cn({ 'fill-secondary-foreground': state?.watchlist })} />
        </Button>
      </div>
      <div className={cn(groupClassName, 'gap-0')}>
        <Link
          className='flex grow'
          href={`/similar?id=${show.id}&title=${encodeURIComponent(show.title)}&type=${show.type}`}
          onClick={onClose}
        >
          <Button className={leftClassName} variant='outline'>
            <Copy size={14} />
            Similar
          </Button>
        </Link>
        <Button
          className={cn(rightClassName, 'bg-red-600')}
          variant='destructive'
          onClick={() =>
            showTorrentsModal({
              imdbID: show.imdb_id!,
              title: show.title,
              backdrop: show.backdrop,
              year: new Date(show.release).getFullYear()
            })
          }
        >
          <Play size={15} />
          Watch
        </Button>
      </div>
    </div>
  );
};

export default Actions;
