'use client';

import { useQuery } from '@tanstack/react-query';

import { genres } from '@/lib/api';

const useGenres = () => {
  return useQuery({
    queryKey: ['genres'],
    queryFn: () => genres()
  });
};

export default useGenres;
