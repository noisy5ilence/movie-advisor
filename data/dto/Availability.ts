// TMDB release types: 1 premiere, 2 limited theatrical, 3 theatrical, 4 digital, 5 physical, 6 TV
const STATE_BY_RELEASE_TYPE: Record<number, AvailabilityState> = {
  1: 'theatre',
  2: 'theatre',
  3: 'theatre',
  4: 'stream',
  5: 'bluray'
};

/** How long a movie is assumed to still be running in theatres when TMDB has no digital/physical date yet */
const THEATRICAL_WINDOW = 120 * 24 * 60 * 60 * 1000;

export const mapReleaseDatesToAvailability = (results?: TMDBCountryReleaseDates[]): Availability | undefined => {
  // TMDB reports dates per country, it doesn't matter where a window opened first — only when
  const availability = (results || []).reduce<Availability>((dates, { release_dates }) => {
    (release_dates || []).forEach(({ type, release_date }) => {
      const state = STATE_BY_RELEASE_TYPE[type];
      const earliest = state && dates[state];

      if (!state || !release_date) return;
      if (!earliest || release_date < earliest) dates[state] = release_date;
    });

    return dates;
  }, {});

  return Object.keys(availability).length ? availability : undefined;
};

export const isUpcoming = (date?: string) => Boolean(date && Date.parse(date) > Date.now());

const isReleased = (date?: string) => Boolean(date && Date.parse(date) <= Date.now());

export const getAvailabilityState = ({ theatre, stream, bluray }: Availability): AvailabilityState | undefined => {
  if (isReleased(bluray)) return 'bluray';
  if (isReleased(stream)) return 'stream';
  if (isUpcoming(theatre)) return 'theatre';
  if (!theatre) return undefined;

  // Still in theatres only while the run lasts or while a digital/physical date is announced but not reached,
  // otherwise TMDB simply never got the digital entry and the movie is long out of cinemas
  const isRunning = Date.now() - Date.parse(theatre) < THEATRICAL_WINDOW;

  return isRunning || isUpcoming(stream) || isUpcoming(bluray) ? 'theatre' : 'stream';
};
