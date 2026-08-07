import Link from 'next/link';

import { Button } from '@/components/ui/button';

const NotFound = () => (
  <div className='flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center'>
    <span className='text-6xl'>404</span>
    <p className='text-muted-foreground'>We couldn’t find that page, movie, or series.</p>
    <Button asChild variant='outline'>
      <Link href='/'>Back to home</Link>
    </Button>
  </div>
);

export default NotFound;
