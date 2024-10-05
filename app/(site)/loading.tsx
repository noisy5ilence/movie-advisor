import { Loader } from 'lucide-react';

const Loading = () => (
  <div className='flex min-h-[70vh] w-full items-center justify-center'>
    <div className='animate-spin'>
      <Loader />
    </div>
  </div>
);

export default Loading;
