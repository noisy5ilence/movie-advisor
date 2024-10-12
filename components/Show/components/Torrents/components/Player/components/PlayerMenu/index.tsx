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
  <Menu.Root className={cn('vds-menu')}>
    <Menu.Button className={cn('vds-menu-button vds-button')} aria-label='Settings'>
      {children}
    </Menu.Button>
    <Menu.Items className={cn('vds-menu-items !p-2')} placement='top end' offset={0}>
      <Menu.RadioGroup>
        {options.map((option) => (
          <Menu.Radio
            key={option.label}
            title={option.label}
            className='flex w-64 cursor-pointer items-center gap-2 truncate p-2'
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
