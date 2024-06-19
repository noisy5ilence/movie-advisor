import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useCastMagnet } from './useMagnetHosts';

const useUrlToMagnet = () => {
  const router = useRouter();
  const encodedUrl = useSearchParams().toString();

  const cast = useCastMagnet();

  useEffect(() => {
    if (!encodedUrl.includes('magnet')) return;

    const url = decodeURIComponent(encodedUrl);

    return void cast(url).finally(() => router.replace('/'));
  }, [encodedUrl]);
};

export default useUrlToMagnet;
