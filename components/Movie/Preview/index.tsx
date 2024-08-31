'use client';

import { FC, ReactNode } from 'react';
import { create, InstanceProps } from 'react-modal-promise';

import Credits from '@/components/Movie/components/Credits';
import { Modal } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import Card from '../Card';

import Actions from './components/Actions';

interface Props {
  movie?: Movie;
  className?: string;
  onClose?: () => void;
  children?: ReactNode;
  card?: ReactNode;
  type?: ShowType;
}

const Preview: FC<Props> = ({ movie, className, onClose, children, card, type = 'movie' }) => {
  if (!movie) return null;

  return (
    <div className={cn('flex flex-col md:flex-row gap-2 rounded-xl', { 'p-2': Boolean(onClose) }, className)}>
      {card || <Card className='mx-auto' movie={movie} />}
      <div className='flex flex-col grow'>
        {children && <div className='flex hover-none:hidden w-full max-sm:mb-0 mb-2 gap-2'>{children}</div>}
        <div className='flex w-full gap-2'>
          <Actions type={type} movie={movie} onClose={onClose} />
        </div>
        <Separator className='my-2' />
        <p key={movie.id} className='leading-7 mb-3'>
          {movie.overview}
        </p>
        <div className='mt-auto grid grid-cols-1 rounded-lg'>
          <Credits type={type} movieId={movie.id} onPersonClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export const showPreviewModal = create(({ onResolve, onClose, movie, type = 'movie' }: Props & InstanceProps<void>) => (
  <Modal className='block p-0' onClose={onResolve}>
    <Preview
      type={type}
      movie={movie}
      className='border-none'
      onClose={() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        onClose?.();
        onResolve();
      }}
    />
  </Modal>
));

export default Preview;
