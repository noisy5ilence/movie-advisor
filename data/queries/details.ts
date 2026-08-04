import movieAdvisor from '../clients/movieAdvisor';
import { mapDetailsToAiring } from '../dto/Airing';
import { mapReleaseDatesToAvailability } from '../dto/Availability';
import { mapMovieSeriesToShow } from '../dto/Show';

export type DetailsQueryProps = {
  showId?: Show['id'];
  showType?: Show['type'];
};

type DetailsResponse = (Movie | Series) &
  Details &
  TMDBSeriesDetails & {
    release_dates?: { results: TMDBCountryReleaseDates[] };
  };

const detailsQuery = ({ showId, showType }: DetailsQueryProps) => ({
  enabled: Boolean(showId),
  queryKey: ['details', showId, showType],
  queryFn: () =>
    movieAdvisor
      .get<DetailsResponse>(
        `/${showType}/${showId}`,
        showType === 'movie' ? { params: { append_to_response: 'release_dates' } } : undefined
      )
      .then(({ release_dates, ...response }) => ({
        ...response,
        ...mapMovieSeriesToShow(response, showType),
        availability: mapReleaseDatesToAvailability(release_dates?.results),
        airing: showType === 'tv' ? mapDetailsToAiring(response) : undefined
      }))
      .catch((error) => Promise.reject(error))
});

export default detailsQuery;
