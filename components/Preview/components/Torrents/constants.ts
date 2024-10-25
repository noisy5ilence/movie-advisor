import { Sort } from '@/api/parsers';

type Options = { query: string; sort: Sort; imdbID: string };

const queryFn = ({ query, sort, imdbID, key }: Options & { key: keyof typeof providers }) =>
  fetch(`/api/torrents?key=${key}&query=${query}&sort=${sort}&imdbID=${imdbID}`).then((response) => response.json());

export const providers = {
  yts: {
    label: 'YTS',
    key: 'yts',
    queryFn: (options: Options) => queryFn({ ...options, key: 'yts' }),
    sortable: false
  },
  tpb: {
    label: 'The Pirate Bay',
    key: 'tpb',
    queryFn: (options: Options) => queryFn({ ...options, key: 'tpb' }),
    sortable: true
  },
  tlk: {
    label: 'Toloka',
    key: 'tlk',
    queryFn: (options: Options) => queryFn({ ...options, key: 'tlk' }),
    sortable: true
  }
};
