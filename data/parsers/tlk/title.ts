import torrentTitle from 'parse-torrent-title';

// Toloka series naming comes in several shapes, often bilingual with both parentheticals present:
//   "Офіс (Сезон 1) / The Office (Season 1) (2005) BDRemux"
//   "Друзі (Сезони 1-10) / Friends (Seasons 1-10) 720p"
//   "Дім дракона (Сезон 3, серій 7 з 8) / House of the Dragon [2026] WEB-DL"
//   "Томас і його друзі (1—4 сезони, 88 зі 104) / Thomas the Tank Engine & Friends (Seasons 1-4, 88 of 104)"
// "[cс]езон" tolerates the Latin "C" homoglyph some uploaders use
const SEASONS = [
  /\(\s*[cс]езон[а-яіїєґ]*\s*(\d+)(?:\s*[-–—−]\s*(\d+))?([^)]*)\)/i,
  /\(\s*(\d+)(?:\s*[-–—−]\s*(\d+))?\s*[cс]езон[а-яіїєґ]*([^)]*)\)/i,
  /\(\s*seasons?\s*(\d+)(?:\s*[-–—−]\s*(\d+))?([^)]*)\)/i
];

// ", Серії 6-7" | ", серій 7 з 8" | ", 85 серій з 106" | ", 88 зі 104" | ", 88 of 104"
const EPISODES = /,\s*(?:сері[яїй][^\d)]*)?(\d+)(?:\s*[-–—−]\s*(\d+))?(?:[^\d)]*?\s(?:зі?|of)\s*(\d+))?/i;

export const parseTolokaTitle = (originalTitle: string) => {
  const seasonMatch = SEASONS.map((pattern) => originalTitle.match(pattern)).find(Boolean);
  const cleaned = SEASONS.reduce((title, pattern) => title.replace(pattern, ' '), originalTitle)
    .replace(/\s+/g, ' ')
    .trim();

  const parsed = torrentTitle.parse(cleaned);
  // a season parenthetical between the two title parts leaves a dangling separator behind
  const title = parsed.title.replace(/\s*[/|]\s*$/, '');

  if (!seasonMatch) {
    const { season, episode } = parsed;

    return { ...parsed, title, episodes: season && episode ? `S${season}:E${episode}` : undefined };
  }

  const [, seasonFrom, seasonTo, details] = seasonMatch;
  const [, from, to, total] = details.match(EPISODES) || [];
  // a bare number with no range, no total and no "серія" marker is not episode info (e.g. a year)
  const hasEpisodes = from && (to || total || /сері/i.test(details));

  const season = `S${seasonFrom}${seasonTo ? `-${seasonTo}` : ''}`;
  const episodes = hasEpisodes ? `:E${from}${to ? `-${to}` : ''}${total ? `/${total}` : ''}` : '';

  return { ...parsed, title, episodes: `${season}${episodes}` };
};
