import trendingQuery, { TrendingQueryProps } from '@/data/queries/trending';
import useInfiniteList from '@/hooks/useInfiniteList';

const useTrending = ({ type, enabled }: TrendingQueryProps) =>
  useInfiniteList({ ...trendingQuery({ type, enabled }), mode: 'default', list: 'trending' });

export default useTrending;
