const STATE_BY_RELEASE_TYPE: Record<number, AvailabilityState> = {
  1: 'theatre',
  2: 'theatre',
  3: 'theatre',
  4: 'stream',
  5: 'bluray'
};

const THEATRICAL_WINDOW = 120 * 24 * 60 * 60 * 1000;

export const mapReleaseDatesToAvailability = (results?: TMDBCountryReleaseDates[]): Availability | undefined => {
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

  const isRunning = Date.now() - Date.parse(theatre) < THEATRICAL_WINDOW;

  return isRunning || isUpcoming(stream) || isUpcoming(bluray) ? 'theatre' : 'stream';
};
