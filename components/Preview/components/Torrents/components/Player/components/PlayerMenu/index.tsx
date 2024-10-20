import { FC, ReactNode, useRef } from 'react';
import { Menu } from '@vidstack/react';

import { cn } from '@/lib/utils';

type Option = { onSelect: (value: string) => void; value: string; label: string };

interface Props {
  children: ReactNode;
  options: Option[];
  value: string;
}

const PlayerMenu: FC<Props> = ({ children, options, value }) => {
  const scrollRef = useRef<HTMLElement>(null);
  const refs = useRef<Record<string, HTMLElement>>({});

  return (
    <Menu.Root
      className={cn('plyr__menu')}
      onOpen={() => scrollRef.current?.scrollTo({ top: refs.current[value].offsetTop - 8 })}
    >
      <Menu.Button className={cn('plyr__controls__item plyr__control')}>{children}</Menu.Button>
      <Menu.Items
        ref={scrollRef}
        className={cn('plyr__menu__container max-h-52 max-w-64 rounded-lg overflow-auto !bg-background after:hidden')}
        placement='top end'
      >
        <Menu.RadioGroup className='flex flex-col gap-2 p-2' value={value}>
          {options.map((option) => (
            <Menu.Radio
              ref={(element) => element && (refs.current[option.value] = element)}
              key={option.value}
              title={option.label}
              onClick={() => option.onSelect(option.value)}
              className={cn(
                '!m-0 cursor-pointer whitespace-normal break-words rounded-sm bg-secondary !px-2 !py-1 text-foreground',
                { 'bg-secondary-foreground text-secondary': value === option.value }
              )}
            >
              {option.label}
            </Menu.Radio>
          ))}
        </Menu.RadioGroup>
      </Menu.Items>
    </Menu.Root>
  );
};

export default PlayerMenu;
