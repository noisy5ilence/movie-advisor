type Unknown = Record<string, any>;

const identity = (payload: Unknown) => payload;

const named = ({ id, name, profile_path }: Unknown) => ({ id, name, profile_path });

const castMember = (member: Unknown) => ({
  ...named(member),
  ...('character' in member ? { character: member.character } : {}),
  ...(member.roles ? { roles: member.roles.map(({ character }: Unknown) => ({ character })) } : {}),
  ...(member.total_episode_count != null ? { total_episode_count: member.total_episode_count } : {})
});

const crewMember = (member: Unknown) => ({
  ...named(member),
  ...(member.job ? { job: member.job } : {}),
  ...(member.jobs ? { jobs: member.jobs.map(({ job }: Unknown) => ({ job })) } : {}),
  ...(member.total_episode_count != null ? { total_episode_count: member.total_episode_count } : {})
});

const withPhoto = ({ profile_path }: Unknown) => Boolean(profile_path);

const credits = ({ cast = [], crew = [], ...rest }: Unknown) => ({
  ...rest,
  cast: cast.filter(withPhoto).map(castMember),
  crew: crew.filter(withPhoto).map(crewMember)
});

const personCredit = (credit: Unknown) => ({
  media_type: credit.media_type,
  id: credit.id,
  overview: credit.overview,
  poster_path: credit.poster_path,
  backdrop_path: credit.backdrop_path,
  vote_average: credit.vote_average,
  vote_count: credit.vote_count,
  ...(credit.media_type === 'tv'
    ? { first_air_date: credit.first_air_date, name: credit.name }
    : { release_date: credit.release_date, title: credit.title })
});

const shown = ({ poster_path, media_type }: Unknown) => Boolean(poster_path) && ['movie', 'tv'].includes(media_type);

const person = ({ combined_credits, ...profile }: Unknown) => ({
  id: profile.id,
  name: profile.name,
  biography: profile.biography,
  birthday: profile.birthday,
  deathday: profile.deathday,
  place_of_birth: profile.place_of_birth,
  known_for_department: profile.known_for_department,
  profile_path: profile.profile_path,
  ...(combined_credits
    ? {
        combined_credits: {
          cast: (combined_credits.cast || []).filter(shown).map(personCredit),
          crew: (combined_credits.crew || []).filter(shown).map(personCredit)
        }
      }
    : {})
});

const trimmers: Array<[RegExp, (payload: Unknown) => Unknown]> = [
  [/^(movie|tv)\/\d+\/(aggregate_)?credits$/, credits],
  [/^person\/\d+$/, person]
];

const trim = (path: string, payload: unknown) => {
  if (!payload || typeof payload !== 'object') return payload;

  const [, trimmer = identity] = trimmers.find(([pattern]) => pattern.test(path)) || [];

  return trimmer(payload as Unknown);
};

export default trim;
