'use client';

import { FC, ReactNode } from 'react';
import { create, InstanceProps } from 'react-modal-promise';

import useDetails from '@/components/Preview/useDetails';
import Card from '@/components/Show';
import Credits from '@/components/Show/components/Credits';
import { Modal } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import Actions from './components/Actions';

interface Props {
  show?: Show;
  // Preview is rendered twice in this project and both times with className. Why it is possibly undefined?
  className?: string;
  onClose?: () => void;
  // Preview is never used with children in this project. What is it for?
  children?: ReactNode;
  // Preview is rendered twice in this project and always with a card. Seems like this prop might not be undefined.
  card?: ReactNode;
}

const Preview: FC<Props> = ({ show: baseShow, className, onClose, children, card }) => {
  // Why even bother to call this hook if there is a chance you will render null on next line?
  const { data: detailedShow } = useDetails({ showId: baseShow?.id, showType: baseShow?.type });

  // Why do it here? Do this outside. You already know if "baseShow" is missing - so no need to render this component and run all this code.
  if (!baseShow) return null;

  // If "detailedShow" is falsy value - "show" is "baseShow" and if "detailedShow" is truthy value - "show" is "baseShow". It can't be undefined!
  const show: (Show & Partial<Details>) | undefined = detailedShow || baseShow;

  return (
    <div className={cn('flex flex-col md:flex-row gap-2 rounded-xl', { 'p-2': Boolean(onClose) }, className)}>
      {/* Preview is rendered twice in this project. Seems like no reason to use "default" card here. Pass this card inside "showPreviewModal" as a prop. */}
      {card || <Card className='mx-auto' show={show} />}
      <div className='flex grow flex-col'>
        {/* You never render Preview's children in this project. And very specific styling for a generic children. Useless code. */}
        {children && <div className='mb-2 flex w-full gap-2 hover-none:hidden max-sm:mb-0'>{children}</div>}
        {/* Why this wrapper is not a part of Actions component? This is the only place where Actions are rendered. */}
        <div className='flex w-full gap-2'>
          <Actions show={show} onClose={onClose} />
        </div>
        <Separator className='my-2' />
        {/* You claimed "show" potentially undefined. How are you going to get "id" from undefined? */}
        {/* Reason to use key here? */}
        <p key={show.id} className='mb-3 leading-7'>
          {/* You claimed "show" potentially undefined. How are you going to get "overview" from undefined? */}
          {show.overview}
        </p>
        {/* Why grid for a single element? */}
        <div className='mt-auto grid grid-cols-1 rounded-lg'>
          {/* You claimed "show" potentially undefined. How are you going to get "type" and "id" from undefined? */}
          {/* Are you going to add onDogClick prop? Why this name? */}
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
