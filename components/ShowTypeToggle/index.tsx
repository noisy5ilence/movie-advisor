'use client';

import { FC } from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Check, ChevronDown, Clapperboard, LucideIcon, Tv } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import analytics from '@/lib/analytics';
import { showTypeFromPath, toShowTypePath } from '@/lib/showType';
import { cn } from '@/lib/utils';

interface Option {
  value: Show['type'];
  label: string;
  icon: LucideIcon;
}

const options: Option[] = [
  { value: 'movie', label: 'Movie', icon: Clapperboard },
  { value: 'tv', label: 'Series', icon: Tv }
];

interface Props {
  className?: string;
}

const ShowTypeToggle: FC<Props> = ({ className }) => {
  const router = useRouter();
  const pathname = usePathname();
  const value = showTypeFromPath(pathname);

  const current = options.find(({ value: optionValue }) => optionValue === value) ?? options[0];

  const handleChange = (next: Show['type']) => {
    if (next === value) return;

    analytics.randomTypeChanged({ type: next });
    router.replace(toShowTypePath(pathname, next), { scroll: false });
  };

  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        <span
          aria-label={`Watch Next: ${current.label}`}
          className={cn(
            'inline-flex h-6 cursor-pointer items-center whitespace-nowrap rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90',
            className
          )}
        >
          <Link
            href={toShowTypePath('/', value)}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
            className='pl-2.5 pr-1.5 text-[15px] font-normal leading-[18px]'
          >
            Watch Next
          </Link>
          <span aria-hidden className='h-4 w-px bg-primary-foreground/40' />
          <span className='flex items-center gap-1.5 pl-1.5 pr-2.5 text-[15px] font-normal leading-[18px]'>
            <span className='text-primary-foreground/70'>{current.label}</span>
            <ChevronDown className='size-3.5 text-primary-foreground/70' />
          </span>
        </span>
      </DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align='start'
          sideOffset={8}
          className={cn(
            'z-50 w-36 rounded-lg border border-border/60 bg-popover p-1 text-popover-foreground shadow-xl',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2'
          )}
        >
          <DropdownMenuPrimitive.RadioGroup value={value} onValueChange={(next) => handleChange(next as Show['type'])}>
            {options.map(({ value: optionValue, label, icon: Icon }) => (
              <DropdownMenuPrimitive.RadioItem
                key={optionValue}
                value={optionValue}
                className={cn(
                  'flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors',
                  'focus:bg-secondary data-[state=checked]:bg-secondary'
                )}
              >
                <Icon className='size-3.5 shrink-0' />
                <span>{label}</span>
                <DropdownMenuPrimitive.ItemIndicator className='ml-auto'>
                  <Check className='size-3.5' />
                </DropdownMenuPrimitive.ItemIndicator>
              </DropdownMenuPrimitive.RadioItem>
            ))}
          </DropdownMenuPrimitive.RadioGroup>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
};

export default ShowTypeToggle;
