import Random from '@/components/Random';
import Trending from '@/components/Trending';

const Container = () => (
  <div className='flex flex-col flex-1'>
    <div className='xs:mb-4'>
      <Random />
      <div className='w-full h-2' />
    </div>
    <div className='xs:block hidden w-full rounded-lg'>
      <Trending />
      <div className='w-full h-2' />
    </div>
  </div>
);

export default Container;
