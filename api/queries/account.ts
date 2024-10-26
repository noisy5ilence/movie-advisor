import movieAdvisor from '../clients/movieAdvisor';

export type AccountQueryProps = {
  session?: string | null;
};

export const KEY = ({ session }: AccountQueryProps) => ['account', session];

const accountQuery = ({ session }: AccountQueryProps) => ({
  enabled: Boolean(session),
  queryKey: KEY({ session }),
  staleTime: Infinity,
  notifyOnChangeProps: ['data' as const],
  queryFn: () =>
    movieAdvisor.get<Account>('/account/null', {
      params: { session_id: session },
      preventCache: true
    })
});

export default accountQuery;
