import { FC, ReactNode } from 'react';
import { Menu } from '@vidstack/react';
import { CheckIcon } from '@vidstack/react/icons';

import { cn } from '@/lib/utils';

type Option = { onClick: () => void; label: string };

interface Props {
  children: ReactNode;
  options: Option[];
  isChecked: (option: Option) => boolean;
}

const PlayerMenu: FC<Props> = ({ children, options, isChecked }) => (
  <Menu.Root className={cn('plyr__menu')}>
    <Menu.Button className={cn('plyr__controls__item plyr__control')} aria-expanded={false}>
      {children}
    </Menu.Button>
    <Menu.Items
      className={cn('plyr__menu__container !p-0 max-h-52 overflow-auto no-scrollbar')}
      placement='top end'
      offset={0}
    >
      <Menu.RadioGroup>
        {options.map((option) => (
          <Menu.Radio
            key={option.label}
            title={option.label}
            className='!m-0 flex w-64 cursor-pointer items-center gap-2 truncate p-2'
            onClick={option.onClick}
          >
            <CheckIcon className={cn('vds-icon shrink-0', { invisible: !isChecked(option) })} size={16} />
            <span className='truncate'>{option.label}</span>
          </Menu.Radio>
        ))}
      </Menu.RadioGroup>
    </Menu.Items>
  </Menu.Root>
);

export default PlayerMenu;
