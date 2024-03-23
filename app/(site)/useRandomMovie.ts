'use client';

import { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Swiper } from 'swiper/types';

import useFilters from '@/app/(site)/useFilters';
import { randomMovies } from '@/lib/api';
import filterUnknownMovies from '@/lib/filterUnknownMovies';

const UPDATE_RATE = 10;

const previousIndexes: Record<string, number> = {};

const useRandomMovie = () => {
  const queryClient = useQueryClient();
  const { filters } = useFilters();
  const indexByFilter = previousIndexes[JSON.stringify(filters)];
  const [index, setIndex] = useState(indexByFilter);
  const ref = useRef<Swiper>();

  const { data: movies, refetch } = useQuery({
    queryKey: ['random-movie', filters],
    queryFn: () => randomMovies({ filters }),
    select(movies) {
      return filterUnknownMovies(movies);
    },
    structuralSharing(_, newData) {
      const uniqueIds: Record<string, number> = {};
      const current = queryClient.getQueryData<Movie[]>(['random-movie', filters]) || [];
      const next = Array.isArray(newData) ? newData : [newData];

      return [...current, ...next].reduce((unique, movie) => {
        if (uniqueIds[movie.id]) return unique;

        uniqueIds[movie.id] = movie.id;
        unique.push(movie);

        return unique;
      }, [] as Movie[]);
    }
  });

  useEffect(() => {
    setIndex(indexByFilter || 0);
  }, [indexByFilter]);

  const previous = () => ref.current?.slidePrev();

  const next = () => ref.current?.slideNext();

  return {
    movies,
    movie: movies?.[index],
    hasPrevious: index > 0,
    onIndexChange: ({ activeIndex }: Swiper) => {
      if ((activeIndex && activeIndex % UPDATE_RATE === 0) || movies!.length < UPDATE_RATE) {
        refetch();
      }
      previousIndexes[JSON.stringify(filters)] = activeIndex;
      setIndex(activeIndex);
    },
    next,
    previous,
    index,
    ref
  };
};

export default useRandomMovie;
