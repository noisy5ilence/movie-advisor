import { mapMovieSeriesToShow } from './Show';

const unique = (credits: TMDBPersonCredit[]) => {
  const titles = new Map<string, TMDBPersonCredit>();

  credits.forEach((credit) => {
    const key = `${credit.media_type}-${credit.id}`;

    if (credit.poster_path && ['movie', 'tv'].includes(credit.media_type) && !titles.has(key)) {
      titles.set(key, credit);
    }
  });

  return Array.from(titles.values());
};

const mapPersonToProfile = ({ combined_credits, ...person }: TMDBPersonDetails): Profile => ({
  id: person.id,
  name: person.name,
  photo: person.profile_path ? `https://image.tmdb.org/t/p/w500${person.profile_path}` : '',
  biography: person.biography || '',
  department: person.known_for_department || '',
  birthday: person.birthday || undefined,
  deathday: person.deathday || undefined,
  birthplace: person.place_of_birth || undefined,
  shows: unique([...(combined_credits?.cast || []), ...(combined_credits?.crew || [])])
    .sort((a, b) => b.vote_count - a.vote_count)
    .map((credit) => mapMovieSeriesToShow(credit, credit.media_type))
});

export default mapPersonToProfile;
