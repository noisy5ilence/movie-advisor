import torrentTitle from 'parse-torrent-title';

const SEASONS = [
  /\(\s*[cс]езон[а-яіїєґ]*\s*(\d+)(?:\s*[-–—−]\s*(\d+))?([^)]*)\)/i,
  /\(\s*(\d+)(?:\s*[-–—−]\s*(\d+))?\s*[cс]езон[а-яіїєґ]*([^)]*)\)/i,
  /\(\s*seasons?\s*(\d+)(?:\s*[-–—−]\s*(\d+))?([^)]*)\)/i
];

const EPISODES = /,\s*(?:сері[яїй][^\d)]*)?(\d+)(?:\s*[-–—−]\s*(\d+))?(?:[^\d)]*?\s(?:зі?|of)\s*(\d+))?/i;

export const parseTolokaTitle = (originalTitle: string) => {
  const seasonMatch = SEASONS.map((pattern) => originalTitle.match(pattern)).find(Boolean);
  const cleaned = SEASONS.reduce((title, pattern) => title.replace(pattern, ' '), originalTitle)
    .replace(/\s+/g, ' ')
    .trim();

  const parsed = torrentTitle.parse(cleaned);
  const title = parsed.title.replace(/\s*[/|]\s*$/, '');

  if (!seasonMatch) {
    const { season, episode } = parsed;

    return { ...parsed, title, episodes: season && episode ? `S${season}:E${episode}` : undefined };
  }

  const [, seasonFrom, seasonTo, details] = seasonMatch;
  const [, from, to, total] = details.match(EPISODES) || [];
  const hasEpisodes = from && (to || total || /сері/i.test(details));

  const season = `S${seasonFrom}${seasonTo ? `-${seasonTo}` : ''}`;
  const episodes = hasEpisodes ? `:E${from}${to ? `-${to}` : ''}${total ? `/${total}` : ''}` : '';

  return { ...parsed, title, episodes: `${season}${episodes}` };
};
