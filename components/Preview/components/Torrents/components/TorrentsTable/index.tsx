import { FC, Fragment } from 'react';
import { Cast, Copy, ListVideo, Magnet, Play } from 'lucide-react';

import { Sort } from '@/api/parsers';
import { Quality } from '@/api/parsers/yts/models';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { providers } from '../../constants';
import { useCastMagnet, usePrefix } from '../../hooks/useMagnetHosts';
import showHostManagerModal from '../HostManager';
import showPlayer from '../Player';
import TableHeadSortable from '../TableHeadSortable';

interface Props {
  title: string;
  backdrop: string;
  torrents: Torrent[];
  sort: Sort;
  sortable: boolean;
  provider: string;
  onChangeSort: (sort: Sort) => void;
}

const TorrentsTable: FC<Props> = ({ title, torrents, backdrop, sort, sortable, provider, onChangeSort }) => {
  const prefix = usePrefix();
  const cast = useCastMagnet();

  const colSpan = 5;

  return (
    <Table className='overflow-hidden rounded-xl'>
      {Boolean(torrents?.length) && (
        <TableHeader>
          <TableRow>
            <TableHead className='hidden px-2 md:table-cell'>Title</TableHead>
            <TableHead className='hidden px-2 md:table-cell'>Resolution</TableHead>
            <TableHeadSortable sortable={sortable} title='Size' sort={Sort.size} value={sort} onChange={onChangeSort} />
            <TableHeadSortable
              sortable={sortable}
              title='Seeders'
              className='max-w-10'
              sort={Sort.seeds}
              value={sort}
              onChange={onChangeSort}
            />
            <TableHead className='cursor-pointer select-none px-2' onClick={() => showHostManagerModal()} />
          </TableRow>
        </TableHeader>
      )}

      <TableBody>
        {torrents?.map((torrent) => {
          const supportedForStream = Boolean(
            (provider === providers.yts.key &&
              torrent.seeders &&
              [Quality.The1080P, Quality.The720P].includes(torrent.quality as Quality)) ||
              torrent.container?.includes('mp4')
          );

          const supportedForCast = prefix && !prefix.includes('{host}');

          return (
            <Fragment key={torrent.magnet + torrent.id}>
              <TableRow className='table-row border-b-0 md:hidden'>
                <TableCell className='break-all p-2' colSpan={colSpan}>
                  <span className='flex w-full flex-wrap items-center gap-3'>
                    {torrent.title} {torrent.year && `[${torrent.year}]`} {torrent.quality && `[${torrent.quality}]`}
                  </span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='hidden break-all p-2 md:table-cell' title={torrent.originalTitle}>
                  {torrent.title} {torrent.year && `[${torrent.year}]`}{' '}
                  <span className='uppercase'>{torrent.source && `[${torrent.source}]`}</span>
                </TableCell>
                <TableCell className='hidden p-2 md:table-cell'>
                  <div className='flex shrink-0 items-center gap-1'>{torrent.quality}</div>
                </TableCell>
                <TableCell className='truncate p-2'>
                  <div className='flex shrink-0 items-center gap-1'>{torrent.size}</div>
                </TableCell>
                <TableCell className='truncate p-2'>{torrent.seeders}</TableCell>
                <TableCell className='p-1 pr-2 text-center'>
                  <div className='no-scrollbar flex max-w-full justify-end gap-2 overflow-auto'>
                    {supportedForStream && (
                      <div
                        className='flex size-8 cursor-pointer items-center justify-center rounded-lg border'
                        onClick={() => showPlayer({ magnet: torrent.magnet, backdrop, title })}
                        title='Play show'
                      >
                        <Play size={20} />
                      </div>
                    )}
                    <a
                      href={`${process.env.NEXT_PUBLIC_TORRENT_PROXY}/stream?m3u&link=${encodeURIComponent(
                        torrent.magnet
                      )}`}
                      className='flex size-8 items-center justify-center rounded-lg border'
                      title='Open using you native video player'
                    >
                      <ListVideo size={20} />
                    </a>
                    <a
                      href={torrent.magnet}
                      className='flex size-8 items-center justify-center rounded-lg border'
                      title='Download magnet'
                    >
                      <Magnet size={20} />
                    </a>
                    <div
                      className='flex size-8 cursor-pointer items-center justify-center rounded-lg border'
                      onClick={() => navigator.clipboard.writeText(torrent.magnet)}
                      title='Copy magnet into clipboard'
                    >
                      <Copy size={20} />
                    </div>
                    {supportedForCast && (
                      <div
                        onClick={() => cast(torrent.magnet!)}
                        className='flex size-8 cursor-pointer items-center justify-center rounded-lg border'
                      >
                        <Cast size={20} />
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            </Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default TorrentsTable;
