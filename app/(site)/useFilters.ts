import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const mapFilters = (filters: Record<string, string>) => {
  try {
    return Object.entries(filters).reduce((filters, [key, value]) => {
      filters[key as keyof Filters] = value.split(',');
      return filters;
    }, {} as Partial<Filters>);
  } catch (e) {
    return {};
  }
};

const useFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams]);
  const setFilters = ({ name, value }: { name: string; value: string[] }) => {
    const search = Object.entries({ ...filters, [name]: value })
      .filter(([_, value]) => value?.length)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    router.replace(`${pathname}?${search}`);
  };

  return {
    filters: useMemo(() => mapFilters(filters), [filters]),
    setFilters
  };
};

export default useFilters;
