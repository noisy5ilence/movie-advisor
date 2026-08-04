import movieAdvisor from '../clients/movieAdvisor';
import mapPersonToProfile from '../dto/Person';

export type PersonQueryProps = {
  personId?: string;
};

const personQuery = ({ personId }: PersonQueryProps) => ({
  enabled: Boolean(personId),
  queryKey: ['person', personId],
  queryFn: () =>
    movieAdvisor
      .get<TMDBPersonDetails>(`/person/${personId}`, {
        params: { append_to_response: 'combined_credits' },
        preventCache: false
      })
      .then(mapPersonToProfile)
      .catch((error) => Promise.reject(error))
});

export default personQuery;
