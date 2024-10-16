import { UserRound } from 'lucide-react';

import { Button } from '@/components/ui/button';

const User = () => {
  return (
    <Button variant='ghost' size='icon'>
      <UserRound size={20} />
    </Button>
  );
};

export default User;
