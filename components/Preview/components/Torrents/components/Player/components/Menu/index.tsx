import React, { FC, forwardRef, MutableRefObject, ReactNode, useLayoutEffect, useRef } from 'react';
import { create, InstanceProps } from 'react-modal-promise';
import { Virtuoso, VirtuosoHandle, VirtuosoProps } from 'react-virtuoso';
import { Menu } from '@vidstack/react';

import { Modal } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type Option = { onSelect: (value: string) => void; value: string; label: string };

interface Props {
  children: ReactNode;
  options: Option[];
  value: string;
  closeOnSelect?: boolean;
}

const showMenu = create(
  ({ onResolve, options, value, closeOnSelect }: InstanceProps<void> & Omit<Props, 'children'>) => {
    const virtuosoRef = useRef<VirtuosoHandle | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null) as MutableRefObject<HTMLDivElement>;

    useLayoutEffect(() => {
      const index = +value || 0;

      if (!index || !virtuosoRef.current) return;

      setTimeout(() => virtuosoRef.current?.scrollToIndex(index), 1000);
    }, [value]);

    return (
      <Modal
        className='max-w-screen-xs rounded-xl p-2'
        onClose={onResolve}
        scrollRef={scrollRef}
        portal={(document.fullscreenElement || document.body) as HTMLElement}
      >
        <Virtuoso
          useWindowScroll
          overscan={10}
          initialItemCount={50}
          ref={virtuosoRef}
          customScrollParent={scrollRef.current}
          defaultItemHeight={56}
          fixedItemHeight={56}
          data={options}
          context={value}
          components={components}
          onClick={closeOnSelect ? () => onResolve() : undefined}
        />
      </Modal>
    );
  }
);

const PlayerMenu: FC<Props> = ({ children, options, value, closeOnSelect }) => {
  return (
    <Menu.Root className={cn('plyr__menu')}>
      <Menu.Button
        onClick={() => showMenu({ options, value, closeOnSelect })}
        className={cn('plyr__controls__item plyr__control')}
      >
        {children}
      </Menu.Button>
    </Menu.Root>
  );
};

const components: VirtuosoProps<Option, string>['components'] = {
  Item: ({ item: option, children, context, ...props }) => {
    if (!option) return null;

    return (
      <div
        {...props}
        key={option.value}
        title={option.label}
        onClick={() => option.onSelect(option.value)}
        className={cn(
          '!m-0 cursor-pointer line-clamp-2 rounded-sm bg-secondary text-left !px-2 !py-1 text-foreground !mb-2',
          {
            'bg-secondary-foreground text-secondary': context === option.value
          }
        )}
      >
        {option.label}
      </div>
    );
  },
  List: forwardRef(function List({ children, ...props }, ref) {
    return (
      <div className='flex flex-col' {...props} ref={ref}>
        {children}
      </div>
    );
  })
};

export default PlayerMenu;
