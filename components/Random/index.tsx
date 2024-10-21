'use client';

import Preview from '../Preview';

import Carousel from './components/Carousel';
import useRandomMovie from './useRandomMovie';

const Random = () => {
  const { movie, movies, onIndexChange, fetchNextPage } = useRandomMovie();

  return (
    <Preview
      show={movie}
      className='rounded-md bg-background'
      poster={<Carousel shows={movies} onIndexChange={onIndexChange} onEndReached={fetchNextPage} />}
    />
  );
};

export default Random;
