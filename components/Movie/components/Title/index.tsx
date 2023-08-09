import { FC, useState } from 'react';
import Marquee from 'react-fast-marquee';

import { useTheme } from '@/hooks/useTheme';

interface Props {
  title: string;
}

const Title: FC<Props> = ({ title }) => {
  const [isScrollableTitle, setIsScrollableTitle] = useState(false);
  const [theme] = useTheme();
  return (
    <Marquee
      play={isScrollableTitle}
      gradient={isScrollableTitle}
      gradientWidth={10}
      gradientColor={theme === 'light' ? [255, 255, 255] : [2, 8, 23]}
      className='movie-title overflow-hidden h-[30px] text-lg font-semibold'
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
