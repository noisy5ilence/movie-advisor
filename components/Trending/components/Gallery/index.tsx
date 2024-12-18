'use client';

import { FC } from 'react';

import Poster from '@/components/Poster';
import { showPreviewModal } from '@/components/Preview';
import ScrollNavigation from '@/components/ScrollNavigation';

interface Props {
  shows: Show[];
}

const Gallery: FC<Props> = ({ shows }) => (
  <ScrollNavigation<HTMLUListElement>>
    {({ setScrollElement }) => (
      <ul
        ref={setScrollElement}
        className='no-scrollbar flex animate-fade-aside-slide-in snap-x snap-mandatory gap-2 overflow-auto rounded-lg opacity-0'
      >
        {shows
          .filter((show) => show.poster['1x'])
          .map((show) => (
            <li key={show.id} className='snap-start'>
              <Poster
                className='!h-[350px] !w-[230px] text-sm'
                show={show}
                onClick={() => showPreviewModal({ show })}
              />
            </li>
          ))}
      </ul>
    )}
  </ScrollNavigation>
);

export default Gallery;
