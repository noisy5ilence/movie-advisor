import { FC, forwardRef, ReactNode, useRef } from 'react';
import { Virtuoso, VirtuosoHandle, VirtuosoProps } from 'react-virtuoso';
import { Menu } from '@vidstack/react';

import { cn } from '@/lib/utils';

type Option = { onSelect: (value: string) => void; value: string; label: string };

interface Props {
  children: ReactNode;
  options: Option[];
  value: string;
  className?: string;
}

const PlayerMenu: FC<Props> = ({ children, options, value, className }) => {
  const virtuosoRef = useRef<VirtuosoHandle | null>(null);

  return (
    <Menu.Root
      className={cn('plyr__menu')}
      onOpen={() =>
        setTimeout(() => {
          virtuosoRef.current?.scrollToIndex({ behavior: 'smooth', index: +value });
        }, 100)
      }
    >
      <Menu.Button className={cn('plyr__controls__item plyr__control')}>{children}</Menu.Button>
      <Menu.Items className={cn('!bg-background rounded-lg h-60 after:hidden p-2', className)} placement='top end'>
        <Virtuoso
          ref={virtuosoRef}
          className='h-full w-72'
          initialItemCount={10}
          data={options}
          context={value}
          components={components}
        />
      </Menu.Items>
    </Menu.Root>
  );
};

const components: VirtuosoProps<Option, string>['components'] = {
  Item: ({ item: option, children, context, ...props }) => {
    if (!option) return null;

    return (
      <Menu.Radio asChild>
        <div
          {...props}
          key={option.value}
          title={option.label}
          onClick={() => option.onSelect(option.value)}
          className={cn(
            '!m-0 cursor-pointer whitespace-normal break-all rounded-sm bg-secondary text-left !px-2 !py-1 text-foreground',
            {
              'bg-secondary-foreground text-secondary': context === option.value
            }
          )}
        >
          {option.label}
        </div>
      </Menu.Radio>
    );
  },
  List: forwardRef(function List({ children, ...props }, ref) {
    return (
      <Menu.RadioGroup asChild className='flex flex-col gap-2' value={props.context}>
        <div {...props} ref={ref}>
          {children}
        </div>
      </Menu.RadioGroup>
    );
  })
};

export default PlayerMenu;
