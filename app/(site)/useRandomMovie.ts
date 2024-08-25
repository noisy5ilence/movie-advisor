'use client';

import { useCallback, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import useFilters from '@/app/(site)/useFilters';
import { randomMovies } from '@/lib/api';

const UPDATE_RATE = 10;

const previousIndexes: Record<string, number> = {};

const useRandomMovie = () => {
  const queryClient = useQueryClient();
  const { filters } = useFilters();
  const indexByFilter = previousIndexes[JSON.stringify(filters)];
  const [index, setIndex] = useState(indexByFilter);

  const { data: movies, refetch } = useQuery({
    queryKey: ['random-movie', filters],
    queryFn: () => randomMovies({ filters }),
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

  return {
    movies,
    movie: movies?.[index],
    hasPrevious: index > 0,
    onIndexChange: useCallback(
      (index: number) => {
        if ((index && index % UPDATE_RATE === 0) || movies!.length < UPDATE_RATE) {
          refetch();
        }
        previousIndexes[JSON.stringify(filters)] = index;
        setIndex(index);
      },
      [movies, filters]
    ),
    index
  };
};

export default useRandomMovie;
