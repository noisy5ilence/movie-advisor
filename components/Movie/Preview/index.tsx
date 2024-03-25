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
  fit?: boolean;
  movie?: Movie;
  className?: string;
  onClose?: () => void;
  children?: ReactNode;
  card?: ReactNode;
}

const Preview: FC<Props> = ({ movie, className, onClose, children, card, fit }) => {
  if (!movie) return null;

  return (
    <div className={cn('rounded-xl text-card-foreground', { 'p-2': Boolean(onClose) }, className)}>
      <div className='flex flex-col lg:flex-row max-w-[100%] gap-2'>
        {card || <Card fit={fit} movie={movie} />}
        <div className='flex flex-col grow'>
          {children && <div className='flex hover-none:hidden w-full max-sm:mb-0 mb-2 gap-2'>{children}</div>}
          <div className='flex w-full gap-2'>
            <Actions movie={movie} onClose={onClose} />
          </div>
          <Separator className='my-2' />
          <p key={movie.id} className='leading-7'>
            {movie.overview}
          </p>
        </div>
      </div>
      <Credits movieId={movie.id} onPersonClick={onClose} />
    </div>
  );
};

export const showPreviewModal = create(({ onResolve, onClose, movie }: Props & InstanceProps<void>) => (
  <Modal className='block p-0' onClose={onResolve}>
    <Preview
      fit
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
