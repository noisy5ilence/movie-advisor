import { useRef } from 'react';
import { useMutation } from '@tanstack/react-query';

import { useSetSession } from '@/hooks/useSession';

import { createRequestToken, createSession } from '../../../../data';

const useAuth = () => {
  const setSession = useSetSession();
  const tabRef = useRef<Window | null>(null);

  const session = useMutation({
    retry: 5,
    mutationFn: createSession,
    onSuccess({ session_id }) {
      setSession(session_id);
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

      session.mutate({ requestToken });
    }
  });

  return requestToken;
};

export default useAuth;
