'use client';

import { FC, useState } from 'react';
import Marquee from 'react-fast-marquee';

interface Props {
  title: string;
  className?: string;
}

const Title: FC<Props> = ({ title, className }) => {
  const [isScrollableTitle, setIsScrollableTitle] = useState(false);
  return (
    <Marquee
      play={isScrollableTitle}
      gradientWidth={10}
      className={`movie-title overflow-hidden h-[30px] text-lg font-semibold ${className}`}
    >
      <div
        ref={(element) => {
          const header = element?.closest('.movie-title') as HTMLDivElement;
          const isScrollableTitle = (header?.offsetWidth || 0) < (element?.offsetWidth || 0);

          isScrollableTitle && setIsScrollableTitle(isScrollableTitle);
        }}
      >
        {title}&nbsp;
      </div>
    </Marquee>
  );
};

export default Title;
