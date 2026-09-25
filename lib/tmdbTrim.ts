type Unknown = Record<string, any>;

const identity = (payload: Unknown) => payload;

const pick = (source: Unknown, keys: string[]): Unknown => {
  const out: Unknown = {};

  keys.forEach((key) => {
    if (key in source) out[key] = source[key];
  });

  return out;
};

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

// Keys must survive even when null: mappers distinguish movie from tv via key presence
// (e.g. `'release_date' in item`) and filter on truthy values.

const listItem = (item: Unknown) =>
  pick(item, [
    'id',
    'title',
    'name',
    'overview',
    'poster_path',
    'backdrop_path',
    'release_date',
    'first_air_date',
    'vote_average',
    'vote_count'
  ]);

const list = ({ page, total_pages, results }: Unknown) => ({
  page,
  total_pages,
  results: (results || []).map(listItem)
});

const releaseDates = ({ results = [] }: Unknown) => ({
  results: results.map(({ release_dates = [] }: Unknown) => ({
    release_dates: release_dates
      .filter(({ type, release_date }: Unknown) => type && release_date)
      .map(({ type, release_date }: Unknown) => ({ type, release_date }))
  }))
});

const details = (payload: Unknown) => {
  const out = pick(payload, [
    'id',
    'title',
    'name',
    'overview',
    'poster_path',
    'backdrop_path',
    'release_date',
    'first_air_date',
    'vote_average',
    'vote_count',
    'runtime',
    'genres',
    'imdb_id',
    'tagline',
    'status',
    'number_of_seasons',
    'last_episode_to_air',
    'next_episode_to_air'
  ]);

  if ('release_dates' in payload) out.release_dates = releaseDates(payload.release_dates);

  return out;
};

const trimmers: Array<[RegExp, (payload: Unknown) => Unknown]> = [
  [/^(movie|tv)\/\d+\/(aggregate_)?credits$/, credits],
  [/^person\/\d+$/, person],
  [/^(movie|tv)\/\d+\/(similar|recommendations)$/, list],
  [/^account\/[^/]+\/(favorite|watchlist)\/(movies|tv)$/, list],
  [/^(discover|search)\/(movie|tv)$/, list],
  [/^trending\/(movie|tv|all)\/(day|week)$/, list],
  [/^(movie|tv)\/\d+$/, details]
];

const trim = (path: string, payload: unknown) => {
  if (!payload || typeof payload !== 'object') return payload;

  const cleanPath = path.replace(/^\//, '');

  const [, trimmer = identity] = trimmers.find(([pattern]) => pattern.test(cleanPath)) || [];

  return trimmer(payload as Unknown);
};

export default trim;
