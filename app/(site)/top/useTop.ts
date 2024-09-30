'use client';

import { topMovies } from '@/api';
import useInfiniteList from '@/hooks/useInfiniteList';

const useTop = () => useInfiniteList({ queryKey: ['top'], queryFn: topMovies });

export default useTop;
