'use client';

import { LogIn,LogOut, User as UserIcon, UserRound } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import useAccount from '@/hooks/useAccount';

import useAuth from './useAuth';
import useLogOut from './useLogOut';

const User = () => {
  const account = useAccount();

  const auth = useAuth();
  const logOut = useLogOut();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon'>
          <UserRound size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          {account ? (
            <>
              <DropdownMenuItem className='pointer-events-none flex cursor-default gap-2'>
                <UserIcon />
                {account.username}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className='flex cursor-pointer items-center gap-2' onClick={logOut}>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem
              className='flex cursor-pointer items-center gap-2'
              disabled={auth.isPending}
              onClick={() => auth.mutate()}
            >
              <LogIn />
              Log in
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default User;
