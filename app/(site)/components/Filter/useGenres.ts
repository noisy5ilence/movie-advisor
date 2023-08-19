'use client';

import { useQuery } from '@tanstack/react-query';

import API from '@/app/(site)/api';
const useGenres = () => {
  return useQuery({
    suspense: false,
    queryKey: ['genres'],
    queryFn: API.genres
  });
};

export default useGenres;
