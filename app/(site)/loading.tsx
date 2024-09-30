import { Loader } from 'lucide-react';

const Loading = () => (
  <div className='w-full min-h-[70vh] flex items-center justify-center'>
    <div className='animate-spin'>
      <Loader />
    </div>
  </div>
);

export default Loading;
