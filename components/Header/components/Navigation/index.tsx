'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';

const paths = [
  { path: '/popular', title: 'Popular' },
  { path: '/top', title: 'Top rated' },
  { path: '/favorites', title: 'Favorites' }
];

interface Props {
  className?: string;
}

export function NavigationSmall({ className }: Props) {
  const currentPath = usePathname();

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon'>
            <Menu size={19} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value={currentPath}>
            {paths.map(({ path, title }) => (
              <Link href={path} legacyBehavior shallow key={path}>
                <DropdownMenuRadioItem value={path}>{title}</DropdownMenuRadioItem>
              </Link>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default function Navigation({ className }: Props) {
  const currentPath = usePathname();

  return (
    <NavigationMenu className={className}>
      <NavigationMenuList>
        {paths.map(({ path, title }) => (
          <NavigationMenuItem key={path}>
            <Link href={path} shallow passHref legacyBehavior>
              <NavigationMenuLink active={path === currentPath} className={navigationMenuTriggerStyle()}>
                {title}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
