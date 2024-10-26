import movieAdvisor from '../clients/movieAdvisor';
import { mapMovieSeriesToShow } from '../dto/Show';

export type DetailsQueryProps = {
  showId?: Show['id'];
  showType?: Show['type'];
};

const detailsQuery = ({ showId, showType }: DetailsQueryProps) => ({
  enabled: Boolean(showId),
  queryKey: ['details', showId, showType],
  queryFn: () =>
    movieAdvisor
      .get<(Movie | Series) & Details>(`/${showType}/${showId}`)
      .then((response) => ({ ...response, ...mapMovieSeriesToShow(response, showType) }))
});

export default detailsQuery;
