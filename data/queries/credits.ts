import movieAdvisor from '../clients/movieAdvisor';

export type CreditsQueryProps = {
  showId?: Show['id'];
  showType?: Show['type'];
};

const photo = (path: string) => `https://image.tmdb.org/t/p/w185${path}`;

// a series has no single director, so the one behind most episodes stands in for it
const findDirector = (crew: Crew[] = []) =>
  crew
    .filter(
      ({ profile_path, job, jobs }) =>
        profile_path && (job === 'Director' || jobs?.some((entry) => entry.job === 'Director'))
    )
    .sort((a, b) => (b.total_episode_count || 0) - (a.total_episode_count || 0))[0];

const creditsQuery = ({ showId, showType }: CreditsQueryProps) => ({
  enabled: Boolean(showId),
  queryKey: ['credits', showId, showType],
  queryFn: () =>
    movieAdvisor
      .get<{
        cast: Array<Actor | AggregatedActor>;
        crew: Crew[];
      }>(`/${showType}/${showId}/${showType === 'tv' ? 'aggregate_credits' : 'credits'}`)
      .then(({ cast, crew }) => {
        const director = findDirector(crew);

        const actors: Actor[] = cast
          .filter((person) => person.profile_path && person.id !== director?.id)
          .map((actor) => {
            const photoUrl = photo(actor.profile_path);

            if ('character' in actor) return { ...actor, photoUrl };

            const [{ character }] = actor.roles || [{}];

            return { ...actor, character, photoUrl };
          });

        if (!director) return actors;

        return [{ ...director, character: 'Director', photoUrl: photo(director.profile_path) }, ...actors];
      })
});

export default creditsQuery;
