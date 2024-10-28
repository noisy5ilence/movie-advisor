import movieAdvisor from '../clients/movieAdvisor';

export type StatesMutationProps = {
  session?: string;
};

export type StatesMutationFnProps = {
  showId: Show['id'];
  showType: Show['type'];
  list: 'favorite' | 'watchlist';
  value: boolean;
};

const statesMutation = ({ session }: StatesMutationProps) => ({
  retry: 2,
  mutationFn: ({ showId, showType, list, value }: StatesMutationFnProps) =>
    movieAdvisor.post(
      `/account/null/${list}`,
      { params: { session_id: session }, preventCache: true },
      {
        media_id: showId,
        media_type: showType,
        [list]: value
      }
    )
});

export default statesMutation;
