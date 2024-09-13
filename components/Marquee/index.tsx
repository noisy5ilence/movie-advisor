import { FC } from 'react';

import Card from '../Movie/Card';
import { showPreviewModal } from '../Movie/Preview';

interface Props {
  movies: Movie[];
}

const Marquee: FC<Props> = ({ movies }) => (
  <ul className='flex overflow-auto gap-2 rounded-lg snap-mandatory snap-x no-scrollbar opacity-0 animate-fade-aside-slide-in'>
    {movies.map((movie) => (
      <li key={movie.id} className='snap-start'>
        <Card className='!h-[350px] !w-[230px] text-sm' movie={movie} onClick={() => showPreviewModal({ movie })} />
      </li>
    ))}
  </ul>
);

export default Marquee;
