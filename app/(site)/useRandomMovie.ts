'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import useFilters from '@/app/(site)/useFilters';
import filterUnknownMovies from '@/lib/filterUnknownMovies';

import API from './api';

const UPDATE_RATE = 10;

const previousIndexes: Record<string, number> = {};

const useRandomMovie = () => {
  const { filters } = useFilters();
  const indexByFilter = previousIndexes[JSON.stringify(filters)];
  const [index, setIndex] = useState(indexByFilter || 0);

  const { data: movies, refetch } = useQuery({
    queryKey: ['random-movie', filters],
    queryFn: () => API.random({ filters }),
    suspense: true,
    select(movies) {
      return filterUnknownMovies(movies);
    },
    structuralSharing(current, next) {
      const uniqueIds: Record<string, number> = {};

      return (current || []).concat(next).reduce((unique, movie) => {
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

  const previous = () => {
    if (!index) return;

    setIndex((index) => index - 1);
  };

  const next = () => {
    if ((index && index % UPDATE_RATE === 0) || movies!.length < UPDATE_RATE) {
      refetch();
    }

    const nextIndex = index + 1;

    previousIndexes[JSON.stringify(filters)] = nextIndex;
    setIndex(nextIndex);
  };

  return {
    movie: movies?.[index],
    hasPrevious: index > 0,
    next,
    previous
  };
};

export default useRandomMovie;
