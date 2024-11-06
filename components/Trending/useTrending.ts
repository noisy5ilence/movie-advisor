import { useQuery } from '@tanstack/react-query';

import trendingQuery, { TrendingQueryProps } from '@/data/queries/trending';

const useTrending = ({ type, enabled }: TrendingQueryProps) => useQuery(trendingQuery({ type, enabled }));

export default useTrending;
