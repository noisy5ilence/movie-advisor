import { FC } from 'react';

import { showPreviewModal } from '@/components/Preview';
import Card from '@/components/Show';

interface Props {
  shows: Show[];
}

const Marquee: FC<Props> = ({ shows }) => (
  <ul className='no-scrollbar flex animate-fade-aside-slide-in snap-x snap-mandatory gap-2 overflow-auto rounded-lg opacity-0'>
    {shows.map((show) => (
      <li key={show.id} className='snap-start'>
        <Card className='!h-[350px] !w-[230px] text-sm' show={show} onClick={() => showPreviewModal({ show })} />
      </li>
    ))}
  </ul>
);

export default Marquee;
