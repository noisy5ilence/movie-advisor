'use client';

import { Bookmark, ExternalLink, Heart, Link, Play, Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import ButtonsGroup from '@/components/ui/buttons-group';
import useShowState, { useMutateShowState } from '@/hooks/useShowState';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';

interface Props {
  show: Show & Partial<Details>;
  className: string;
  externalLink: boolean;
}

const Actions = ({ show, className, externalLink }: Props) => {
  const { toast } = useToast();
  const state = useShowState({ showId: show.id, showType: show.type });
  const toggle = useMutateShowState(show);

  const copyLink = (
    <Button
      aria-label='Copy link'
      title='Copy link'
      variant='outline'
      className='h-8 px-3'
      onClick={() =>
        navigator.clipboard
          .writeText(`${location.origin}/${show.type}/${show.id}`)
          .then(() => toast({ description: 'Link has been copied' }))
      }
    >
      <Link size={14} />
    </Button>
  );

  return (
    <div className={cn('flex gap-2 flex-grow-0', className)}>
      <div className='flex flex-wrap gap-2'>
        <ButtonsGroup className='pointer-events-none'>
          <Button aria-label='Show rating' variant='outline'>
            <Star size={14} />
          </Button>
          <Button variant='outline' className='w-[43px]'>
            {show.rating.toFixed(1)}
          </Button>
        </ButtonsGroup>
        <ButtonsGroup>
          <Button
            aria-label={`${state?.favorite ? 'Remove from' : 'Add to'} favorites`}
            title={`${state?.favorite ? 'Remove from' : 'Add to'} favorites`}
            variant='outline'
            disabled={toggle.list === 'favorite' && toggle.isPending}
            onClick={() => toggle.mutate({ list: 'favorite', value: !state?.favorite })}
          >
            <Heart size={14} className={cn({ 'fill-secondary-foreground': state?.favorite })} />
          </Button>
          <Button
            aria-label={`${state?.watchlist ? 'Remove from' : 'Add to'} watch list`}
            title={`${state?.watchlist ? 'Remove from' : 'Add to'} watch list`}
            variant='outline'
            disabled={toggle.list === 'watchlist' && toggle.isPending}
            onClick={() => toggle.mutate({ list: 'watchlist', value: !state?.watchlist })}
          >
            <Bookmark size={14} className={cn({ 'fill-secondary-foreground': state?.watchlist })} />
          </Button>
        </ButtonsGroup>
        {externalLink ? (
          <ButtonsGroup>
            {copyLink}
            {externalLink && (
              <Button
                aria-label='Open in new tab'
                title='Open in new tab'
                variant='outline'
                className='relative h-8 px-3'
                onClick={() => window.open(`${location.origin}/${show.type}/${show.id}`, '_blank')}
              >
                <ExternalLink size={14} />
              </Button>
            )}
          </ButtonsGroup>
        ) : (
          copyLink
        )}
      </div>
      <Button
        aria-label='Watch'
        className='ml-auto h-8 gap-1.5 bg-red-600 px-3 transition-all duration-200 hover:bg-red-600 hover:shadow-lg hover:shadow-red-600/60 sm:ml-0 dark:bg-red-700'
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
    </div>
  );
};

export default Actions;
