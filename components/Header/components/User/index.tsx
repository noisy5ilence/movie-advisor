'use client';

import { UserRound } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import useAuth from './useAuth';

const User = () => {
  const auth = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon'>
          <UserRound size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem className='flex justify-center text-center' onClick={() => auth.mutate()}>
            Log in
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator /> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default User;
