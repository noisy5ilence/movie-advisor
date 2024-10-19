import { TPBTorrents, YTSTorrents } from '@/api';

export const providers = {
  yts: { label: 'YTS', key: 'yts', queryFn: YTSTorrents, sortable: false },
  tpb: { label: 'The Pirate Bay', key: 'tpb', queryFn: TPBTorrents, sortable: true }
};
