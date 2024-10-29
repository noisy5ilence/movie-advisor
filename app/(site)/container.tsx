import { FC } from 'react';

import Random from '@/components/Random';
import Trending from '@/components/Trending';

interface Props {
  page: number;
}

const Container: FC<Props> = ({ page }) => (
  <div className='flex flex-1 flex-col'>
    <div className='xs:mb-4'>
      <Random page={page} />
      <div className='h-2 w-full' />
    </div>
    <div className='hidden w-full rounded-lg xs:block'>
      <Trending />
      <div className='h-2 w-full' />
    </div>
  </div>
);

export default Container;
