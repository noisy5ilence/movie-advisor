import { FC, Fragment } from 'react';
import { Cast, ListVideo, Magnet, Play } from 'lucide-react';

import { Sort } from '@/api/parsers';
import { Quality } from '@/api/parsers/yts/models';
import { Button } from '@/components/ui/button';
import ButtonsGroup from '@/components/ui/buttons-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

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
  year: number;
  onChangeSort: (sort: Sort) => void;
}

const TorrentsTable: FC<Props> = ({ title, torrents, backdrop, sort, sortable, provider, year, onChangeSort }) => {
  const prefix = usePrefix();
  const cast = useCastMagnet();

  const colSpan = 5;

  return (
    <Table className='overflow-hidden rounded-xl'>
      {Boolean(torrents?.length) && (
        <TableHeader>
          <TableRow className='hover:bg-transparent'>
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

          const yearView = torrent.year && year.toString() != torrent.year && `[${torrent.year}]`;

          return (
            <Fragment key={torrent.magnet + torrent.id}>
              <TableRow className='table-row border-b-0 hover:bg-transparent md:hidden'>
                <TableCell className='break-all p-2' colSpan={colSpan}>
                  <span className='flex w-full flex-wrap items-center gap-3'>
                    {torrent.title} {yearView} {torrent.quality && `[${torrent.quality}]`}
                  </span>
                </TableCell>
              </TableRow>
              <TableRow className='hover:bg-transparent'>
                <TableCell className='hidden break-all p-2 md:table-cell' title={torrent.originalTitle}>
                  {torrent.title} {yearView}{' '}
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
                  <ButtonsGroup className='ml-auto w-fit grow-0'>
                    {supportedForStream && (
                      <Button
                        variant='destructive'
                        className={cn('flex-grow-0 px-3 bg-red-600')}
                        onClick={() => showPlayer({ magnet: torrent.magnet, backdrop, title })}
                        title='Play'
                      >
                        <Play size={15} />
                      </Button>
                    )}
                    <Button
                      variant='outline'
                      className='relative grow-0 px-3'
                      title='Play using your native video player'
                    >
                      <a
                        className='absolute left-0 top-0 size-full'
                        href={`${process.env.NEXT_PUBLIC_TORRENT_PROXY}/stream?m3u&link=${encodeURIComponent(
                          torrent.magnet
                        )}`}
                      />
                      <ListVideo size={20} />
                    </Button>
                    <Button className='relative grow-0 px-3' variant='outline' title='Download magnet'>
                      <a className='absolute left-0 top-0 size-full' href={torrent.magnet} />
                      <Magnet size={20} />
                    </Button>
                    {supportedForCast && (
                      <Button className='grow-0 px-3' variant='outline' onClick={() => cast(torrent.magnet!)}>
                        <Cast size={20} />
                      </Button>
                    )}
                  </ButtonsGroup>
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
