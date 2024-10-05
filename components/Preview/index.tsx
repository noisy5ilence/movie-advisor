'use client';

import { FC, ReactNode } from 'react';
import { create, InstanceProps } from 'react-modal-promise';

import Card from '@/components/Show';
import Credits from '@/components/Show/components/Credits';
import { Modal } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import Actions from './components/Actions';

interface Props {
  show?: Show;
  className?: string;
  onClose?: () => void;
  children?: ReactNode;
  card?: ReactNode;
}

const Preview: FC<Props> = ({ show, className, onClose, children, card }) => {
  if (!show) return null;

  return (
    <div className={cn('flex flex-col md:flex-row gap-2 rounded-xl', { 'p-2': Boolean(onClose) }, className)}>
      {card || <Card className='mx-auto' show={show} />}
      <div className='flex grow flex-col'>
        {children && <div className='mb-2 flex w-full gap-2 hover-none:hidden max-sm:mb-0'>{children}</div>}
        <div className='flex w-full gap-2'>
          <Actions show={show} onClose={onClose} />
        </div>
        <Separator className='my-2' />
        <p key={show.id} className='mb-3 leading-7'>
          {show.overview}
        </p>
        <div className='mt-auto grid grid-cols-1 rounded-lg'>
          <Credits showType={show.type} showId={show.id} onPersonClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export const showPreviewModal = create(({ onResolve, onClose, show }: Props & InstanceProps<void>) => (
  <Modal className='block p-0' onClose={onResolve}>
    <Preview
      show={show}
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
