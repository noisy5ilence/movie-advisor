'use client';

import { FC } from 'react';

import Preview from '../Preview';

import Carousel from './components/Carousel';
import useRandomMovie from './useRandomMovie';

interface Props {
  page: number;
}

const Random: FC<Props> = ({ page }) => {
  const { movie, movies, onIndexChange, fetchNextPage } = useRandomMovie({ page });

  return (
    <Preview
      show={movie}
      className='rounded-md bg-background'
      poster={<Carousel shows={movies} onIndexChange={onIndexChange} onEndReached={fetchNextPage} />}
    />
  );
};

export default Random;
