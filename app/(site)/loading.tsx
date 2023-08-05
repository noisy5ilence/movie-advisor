import { Loader } from 'lucide-react';
export default function Loading() {
  return (
    <div className='w-full min-h-[70vh] flex items-center justify-center'>
      <div className='animate-spin'>
        <Loader />
      </div>
    </div>
  );
}
