'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { SlidersHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import useMounted from '@/hooks/useMounted';
import { genres } from '@/lib/api';
import getQueryClient from '@/lib/queryClient';

import Filter from './Filter';

const isShowFilterAtom = atomWithStorage('is-show-filters', false);

export default function FilterToggle() {
  const [isShowFilter, setIsShowFilter] = useAtom(isShowFilterAtom);
  const isMounted = useMounted();

  useEffect(() => {
    const queryClient = getQueryClient();

    queryClient.prefetchQuery({ queryKey: ['genres'], queryFn: () => genres() });
  }, []);

  return (
    <>
      {isShowFilter && <Filter />}
      {isMounted &&
        createPortal(
          <Button
            className='p-2'
            onClick={() => setIsShowFilter((isShow) => !isShow)}
            title={isShowFilter ? 'Hide filters' : 'Show filters'}
            variant='ghost'
          >
            <SlidersHorizontal size={19} />
          </Button>,
          document.getElementById('actions')!
        )}
    </>
  );
}
