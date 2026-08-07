'use client';

import { FC, ReactNode } from 'react';

import Poster from '@/components/Poster';
import Credits from '@/components/Preview/components/Credits';
import useDetails from '@/components/Preview/useDetails';
import { cn } from '@/lib/utils';

import Actions from './components/Actions';
import Airing from './components/Airing';
import YearHint from './components/YearHint';

interface Props {
  show?: Show & Partial<Details>;
  showType?: Show['type'];
  showId?: Show['id'];
  className?: string;
  posterClassName?: string;
  modal?: boolean;
  poster?: ReactNode;
  externalLink?: boolean;
}

const Preview: FC<Props> = ({
  show: baseShow,
  showType,
  showId,
  className,
  posterClassName,
  modal,
  poster,
  externalLink = true
}) => {
  const { data: detailedShow } = useDetails({ showId: showId || baseShow?.id, showType: showType || baseShow?.type });

  if (!baseShow && !detailedShow) return null;

  const show: Show & Partial<Details> = (detailedShow || baseShow)!;

  const isModal = Boolean(modal);

  return (
    <div
      className={cn(
        'flex flex-col md:flex-row gap-2 rounded-xl overflow-hidden',
        { 'gap-0 md:p-0 p-2': isModal },
        className
      )}
    >
      {poster || <Poster className={cn('mx-auto md:rounded-none md:rounded-l-xl', posterClassName)} show={show} />}
      <div className={cn('flex grow flex-col bg-background', { 'p-0 pt-2 md:p-2': isModal })}>
        <span className='order-3 mb-4 text-3xl md:order-1 md:line-clamp-2'>{show.title}</span>

        <div className='order-3 mb-4 flex w-full flex-wrap items-center gap-5 whitespace-nowrap text-sm md:order-2'>
          {Boolean(show.availability) ? <YearHint show={show} /> : <span>{new Date(show.release).getFullYear()}</span>}
          {Boolean(show.airing) && <Airing airing={show.airing!} className='animate-fade-aside-slide-in opacity-0' />}
          {Boolean(show.runtime) && (
            <span className='animate-fade-aside-slide-in opacity-0'>{show.runtime} minutes</span>
          )}
          {Boolean(show.genres) && (
            <span className='animate-fade-aside-slide-in opacity-0'>
              {show.genres
                ?.slice(0, 3)
                .map(({ name }) => name)
                .join(' | ')}
            </span>
          )}
        </div>

        <Actions externalLink={externalLink} className='order-1 mb-4 md:order-2' show={show} />

        <p key={show.id} className='order-4 md:order-4 md:line-clamp-3' title={show.overview}>
          {show.overview}
        </p>
        <div className='order-5 mt-5 grid grid-cols-1 rounded-lg md:order-5 md:mt-auto'>
          <Credits showType={show.type} showId={show.id} />
        </div>
      </div>
    </div>
  );
};

export default Preview;
