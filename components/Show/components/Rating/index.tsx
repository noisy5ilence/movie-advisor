import { FC } from 'react';
import { Star } from 'lucide-react';

interface Props {
  rating?: number;
}

const Rating: FC<Props> = ({ rating }) => (
  <span className='flex items-center'>
    <Star size={18} className='mr-1 fill-white' />
    <p className='mt-[3px]'>{rating?.toFixed(1)}</p>
  </span>
);

export default Rating;
