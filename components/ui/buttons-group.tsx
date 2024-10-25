import { Children, cloneElement, FC, isValidElement, ReactElement, ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface Props {
  children: ReactNode;
  className?: string;
}

const ButtonsGroup: FC<Props> = ({ children, className }) => (
  <div className={cn('flex bg-input gap-[1px] rounded-md md:flex-grow-0 flex-grow group', className)}>
    {Children.map(children, (child) => {
      if (!isValidElement(child)) return null;

      return cloneElement(child as ReactElement<{ className?: string }>, {
        className: cn(
          'h-8 gap-1 flex-grow md:px-3 px-2 [&:not(:first-child):not(:last-child)]:border-x-0 rounded-none first:border-r-0 first:rounded-l-md last:border-l-0 last:rounded-r-md',
          child.props.className
        )
      });
    })}
  </div>
);

export default ButtonsGroup;
