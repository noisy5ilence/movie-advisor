'use client';

import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { mapFilters } from '@/lib/utils';

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
