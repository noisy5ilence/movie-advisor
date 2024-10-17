import { useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';

import { createRequestToken } from '@/api';

const useAuth = () => {
  const tabRef = useRef<Window | null>(null);

  useEffect(() => {
    const approveSource = new EventSource('/api/auth');

    approveSource.onmessage = (event) => {
      console.log(event.data);
      tabRef.current?.close();
      approveSource.close();
    };

    return () => {
      approveSource.close();
    };
  }, []);

  return useMutation({
    mutationFn: createRequestToken,
    onSuccess(requestToken) {
      const link = `https://www.themoviedb.org/authenticate/${requestToken}?redirect_to=${encodeURIComponent(
        `${location.origin}/api/approved`
      )}`;

      tabRef.current = window.open(link, '_blank');
    }
  });
};

export default useAuth;
