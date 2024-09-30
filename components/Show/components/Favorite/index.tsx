'use client';

import { FC } from 'react';
import { Heart } from 'lucide-react';

import { useFavoriteToggle } from '@/app/(site)/favorites/useFavorites';
import { cn } from '@/lib/utils';

interface Props {
  show: Show;
}

const Favorite: FC<Props> = ({ show }) => {
  const { isFavorite, toggle } = useFavoriteToggle(show);

  return (
    <span onClick={toggle} className='cursor-pointer' title={isFavorite ? 'Remove from favorites' : 'Add to favorite'}>
      <Heart className={cn(isFavorite && 'fill-white')} size={20} />
    </span>
  );
};

export default Favorite;
