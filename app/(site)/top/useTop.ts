'use client';

import { topMovies } from '@/api';
import useInfiniteList from '@/hooks/useInfiniteList';

const useTop = () => useInfiniteList({ suspense: true, queryKey: ['top'], queryFn: topMovies });

export default useTop;
