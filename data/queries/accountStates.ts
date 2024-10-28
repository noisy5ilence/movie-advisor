import movieAdvisor from '../clients/movieAdvisor';

export type StatesQueryProps = { showId?: Show['id']; showType?: Show['type']; session?: string };

const statesQuery = ({ showId, showType, session }: StatesQueryProps) => ({
  enabled: Boolean(showId),
  queryKey: ['states', showId, showType, session],
  staleTime: Infinity,
  queryFn: () =>
    movieAdvisor.get<ShowState>(`/${showType}/${showId}/account_states`, {
      params: { session_id: session },
      preventCache: true
    })
});

export default statesQuery;
