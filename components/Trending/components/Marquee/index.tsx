import { FC } from 'react';

import { showPreviewModal } from '@/components/Preview';
import Card from '@/components/Show';

interface Props {
  shows: Show[];
}

const Marquee: FC<Props> = ({ shows }) => (
  <ul className='flex overflow-auto gap-2 rounded-lg snap-mandatory snap-x no-scrollbar opacity-0 animate-fade-aside-slide-in'>
    {shows.map((show) => (
      <li key={show.id} className='snap-start'>
        <Card className='!h-[350px] !w-[230px] text-sm' show={show} onClick={() => showPreviewModal({ show })} />
      </li>
    ))}
  </ul>
);

export default Marquee;
