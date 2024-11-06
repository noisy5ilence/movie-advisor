'use client';

import { FC, ReactNode } from 'react';
import { create, InstanceProps } from 'react-modal-promise';

import Poster from '@/components/Poster';
import Credits from '@/components/Preview/components/Credits';
import useDetails from '@/components/Preview/useDetails';
import { Modal } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

import Actions from './components/Actions';

interface Props {
  show?: Show & Partial<Details>;
  showType?: Show['type'];
  showId?: Show['id'];
  className?: string;
  posterClassName?: string;
  onClose?: () => void;
  poster?: ReactNode;
}

const Preview: FC<Props> = ({ show: baseShow, showType, showId, className, posterClassName, onClose, poster }) => {
  const { data: detailedShow } = useDetails({ showId: showId || baseShow?.id, showType: showType || baseShow?.type });

  if (!baseShow && !detailedShow) return null;

  const show: Show & Partial<Details> = (detailedShow || baseShow)!;

  const isModal = Boolean(onClose);

  return (
    <div
      className={cn(
        'flex flex-col md:flex-row gap-2 rounded-xl overflow-hidden',
        { 'gap-0 md:p-0 p-2': isModal },
        className
      )}
    >
      {poster || <Poster className={cn('mx-auto md:rounded-none md:rounded-l-xl', posterClassName)} show={show} />}
      <div className={cn('flex grow flex-col bg-background', { 'p-0 pt-1 md:p-2': isModal })}>
        <span className='order-3 mb-4 text-3xl md:order-1 md:line-clamp-2'>{show.title}</span>

        <div className='order-3 mb-4 flex w-full flex-wrap gap-5 whitespace-nowrap text-sm md:order-2'>
          <span>{new Date(show.release).getFullYear()}</span>
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

        <Actions className='order-1 mb-4 mt-1 md:order-2 md:mt-0' show={show} />

        <p key={show.id} className='order-4 md:order-4 md:line-clamp-3' title={show.overview}>
          {show.overview}
        </p>
        <div className='order-5 mt-5 grid grid-cols-1 rounded-lg md:order-5 md:mt-auto'>
          <Credits showType={show.type} showId={show.id} onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export const showPreviewModal = create(({ onResolve, onClose, show }: Props & InstanceProps<void>) => (
  <Modal className='block bg-background p-0 md:bg-black' onClose={onResolve}>
    <Preview
      show={show}
      onClose={() => {
        onClose?.();
        onResolve();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    />
  </Modal>
));

export default Preview;
