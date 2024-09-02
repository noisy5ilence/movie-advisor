import { FC } from 'react';
import Card from '../Movie/Card';
import { showPreviewModal } from '../Movie/Preview';

interface Props {
  movies: Movie[];
}

const Marquee: FC<Props> = ({ movies }) => {
  return (
    <ul className='flex overflow-auto gap-2 rounded-lg snap-mandatory snap-x no-scrollbar'>
      {movies.map((movie) => (
        <li key={movie.id} className='snap-start'>
          <Card className='!h-[250px] !w-[175px] text-sm' movie={movie} onClick={() => showPreviewModal({ movie })} />
        </li>
      ))}
    </ul>
  );
};

export default Marquee;
