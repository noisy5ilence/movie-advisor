import { useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';

import sessionMutation from '@/data/mutations/session';
import tokenMutation from '@/data/mutations/token';
import { useSetSession } from '@/hooks/useSession';
import { useToast } from '@/hooks/useToast';

const AUTH_RETRIES = 10;

const useAuth = () => {
  const setSession = useSetSession();
  const tabRef = useRef<Window | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();
  const retryRef = useRef(AUTH_RETRIES);

  const { toast } = useToast();

  useEffect(() => {
    const interval = intervalRef.current;
    return () => clearInterval(interval);
  }, []);

  const session = useMutation({
    ...sessionMutation(),
    onSuccess({ session_id }) {
      setSession(session_id);
      clearInterval(intervalRef.current);

      tabRef.current?.close();
    },
    onError() {
      if (!--retryRef.current) {
        toast({ title: 'Authorization failed', description: 'Try to authorize later' });

        tabRef.current?.close();

        return clearInterval(intervalRef.current);
      }
    }
  });

  const requestToken = useMutation({
    ...tokenMutation(),
    onMutate() {
      tabRef.current = window.open('', '_blank');
      tabRef.current?.focus();
    },
    onSuccess({ redirectUrl, requestToken }) {
      if (!tabRef.current) return;

      retryRef.current = AUTH_RETRIES;
      tabRef.current.location = redirectUrl;

      intervalRef.current = setInterval(() => session.mutate({ requestToken }), 2000);
    }
  });

  return requestToken;
};

export default useAuth;
