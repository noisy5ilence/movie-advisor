import movieAdvisor from '../clients/movieAdvisor';

export type CreditsQueryProps = {
  showId?: Show['id'];
  showType?: Show['type'];
};

const creditsQuery = ({ showId, showType }: CreditsQueryProps) => ({
  enabled: Boolean(showId),
  queryKey: ['credits', showId, showType],
  queryFn: () =>
    movieAdvisor
      .get<{
        cast: Array<Actor | AggregatedActor>;
      }>(`/${showType}/${showId}/${showType === 'tv' ? 'aggregate_credits' : 'credits'}`)
      .then(({ cast }) => {
        return cast
          .filter((person) => person.profile_path)
          .map((actor) => {
            const photoUrl = `https://image.tmdb.org/t/p/w185${actor.profile_path}`;

            if ('character' in actor) return { ...actor, photoUrl };

            const [{ character }] = actor.roles || [{}];

            return { ...actor, character, photoUrl };
          });
      })
});

export default creditsQuery;
