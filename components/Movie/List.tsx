import { FC, Fragment, useLayoutEffect, useState } from 'react';
import { InfiniteData, useInfiniteQuery, UseInfiniteQueryResult } from '@tanstack/react-query';

import Card from '@/components/Movie/Card';
import Preview from '@/components/Movie/Preview';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import filterUnknownMovies from '@/lib/filterUnknownMovies';

interface Props {
  pages: Array<MovieDBResponse>;
  hasNextPage?: boolean;
  fetchNextPage?: () => void;
}

const List: FC<Props> = ({ pages, hasNextPage, fetchNextPage }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loader, setLoader] = useState<HTMLLIElement>();

  useLayoutEffect(() => {
    if (!loader || !hasNextPage) return;

    const observer = new IntersectionObserver(
      ([{ isIntersecting }]) => {
        if (!isIntersecting) return;

        fetchNextPage?.();
      },
      {
        threshold: 1
      }
    );

    observer.observe(loader);

    return () => observer.disconnect();
  }, [fetchNextPage, loader, hasNextPage]);

  return (
    <>
      <ul className='flex gap-3 flex-wrap justify-between grow'>
        {pages.map((page) => (
          <Fragment key={page.page}>
            {filterUnknownMovies(page.results)?.map((movie, index, array) => (
              <li
                key={movie.id}
                className='flex grow basis-[300px] cursor-pointer'
                onClick={() => setMovie(movie)}
                ref={array.length / 2 !== index ? undefined : (element) => setLoader(element!)}
              >
                <Card movie={movie} className='grow flex flex-col' />
              </li>
            ))}
          </Fragment>
        ))}
      </ul>
      <div className='h-4 w-full' />
      {movie && (
        <Dialog defaultOpen={true} onOpenChange={(isOpen) => !isOpen && setMovie(null)}>
          <DialogContent className='block p-0'>
            <Preview
              key={movie.id}
              movie={movie}
              className='border-none'
              onPersonClick={() => {
                setMovie(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default List;
