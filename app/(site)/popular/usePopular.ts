'use client';

import { popularMovies } from '@/api';
import useInfiniteList from '@/hooks/useInfiniteList';

const usePopular = () => useInfiniteList({ suspense: true, queryKey: ['popular'], queryFn: popularMovies });

export default usePopular;
