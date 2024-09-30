'use client';

import { popularMovies } from '@/api';
import useInfiniteList from '@/hooks/useInfiniteList';

const usePopular = () => useInfiniteList({ queryKey: ['popular'], queryFn: popularMovies });

export default usePopular;
