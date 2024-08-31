'use client';

import { startTransition, useCallback, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { randomMovies } from '@/lib/api';

const UPDATE_RATE = 10;

let previousIndex: number = 0;

const useRandomMovie = () => {
  const queryClient = useQueryClient();
  const [index, setIndex] = useState(previousIndex);

  const { data: movies, refetch } = useQuery({
    queryKey: ['random-movie'],
    queryFn: () => randomMovies({ filters: {} }),
    structuralSharing(_, newData) {
      const uniqueIds: Record<string, number> = {};
      const current = queryClient.getQueryData<Movie[]>(['random-movie']) || [];
      const next = Array.isArray(newData) ? newData : [newData];

      return [...current, ...next].reduce((unique, movie) => {
        if (uniqueIds[movie.id]) return unique;

        uniqueIds[movie.id] = movie.id;
        unique.push(movie);

        return unique;
      }, [] as Movie[]);
    }
  });

  return {
    movies,
    movie: movies?.[index],
    hasPrevious: index > 0,
    onIndexChange: useCallback(
      (index: number) => {
        if ((index && index % UPDATE_RATE === 0) || movies!.length < UPDATE_RATE) {
          refetch();
        }
        previousIndex = index;
        startTransition(() => setIndex(index));
      },
      [movies]
    ),
    index
  };
};

export default useRandomMovie;
