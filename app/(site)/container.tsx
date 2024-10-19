import Random from '@/components/Random';
import Trending from '@/components/Trending';

const Container = () => (
  <div className='flex flex-1 flex-col'>
    <div className='xs:mb-4'>
      <Random />
      <div className='h-2 w-full' />
    </div>
    <div className='hidden w-full rounded-xl xs:block'>
      <Trending />
      <div className='h-2 w-full' />
    </div>
  </div>
);

export default Container;
