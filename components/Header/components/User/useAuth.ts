import { useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';

import { useSetSession } from '@/hooks/useSession';

import { createRequestToken, createSession } from '../../../../data';

const useAuth = () => {
  const setSession = useSetSession();
  const tabRef = useRef<Window | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const interval = intervalRef.current;
    return () => clearInterval(interval);
  }, []);

  const session = useMutation({
    mutationFn: createSession,
    onSuccess({ session_id }) {
      setSession(session_id);
      clearInterval(intervalRef.current);

      tabRef.current?.close();
    }
  });

  const requestToken = useMutation({
    mutationFn: createRequestToken,
    onMutate() {
      tabRef.current = window.open('', '_blank');
      tabRef.current?.focus();
    },
    onSuccess({ redirectUrl, requestToken }) {
      if (!tabRef.current) return;

      tabRef.current.location = redirectUrl;

      intervalRef.current = setInterval(() => session.mutate({ requestToken }), 2000);
    }
  });

  return requestToken;
};

export default useAuth;
