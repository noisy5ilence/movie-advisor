import { FC } from 'react';

import Preview from '@/components/Preview';
import Trending from '@/components/Trending';

interface Props {
  showId: Show['id'];
  showType: Show['type'];
}

const Container: FC<Props> = ({ showId, showType }) => (
  <div className='flex flex-1 flex-col'>
    <div className='xs:mb-4'>
      <Preview
        showId={showId}
        showType={showType}
        className='rounded-lg bg-background'
        posterClassName='md:rounded-lg'
      />
      <div className='h-2 w-full' />
    </div>
    <div className='hidden w-full rounded-lg xs:block'>
      <Trending preview showId={showId} showType={showType} />
      <div className='h-2 w-full' />
    </div>
  </div>
);

export default Container;
