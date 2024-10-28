import { useQuery } from '@tanstack/react-query';

import trendingQuery, { TrendingQueryProps } from '@/data/queries/trending';

const useTrending = ({ type }: TrendingQueryProps) => useQuery(trendingQuery({ type }));

export default useTrending;
