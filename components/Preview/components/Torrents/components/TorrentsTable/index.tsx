import { FC, Fragment } from 'react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sort } from '@/data/parsers';

import showHostManagerModal from '../HostManager';
import TableHeadSortable from '../TableHeadSortable';

import Actions from './components/Actions';

interface Props {
  title: string;
  backdrop: string;
  torrents: Torrent[];
  sort: Sort;
  sortable: boolean;
  provider: string;
  year: number;
  onChangeSort: (sort: Sort) => void;
  onPlay: (options: Promise<{ sources: Sources; magnet: string }>) => void;
  playerEntryId: string;
}

const TorrentsTable: FC<Props> = ({
  title,
  torrents,
  backdrop,
  sort,
  sortable,
  provider,
  year,
  onChangeSort,
  onPlay,
  playerEntryId
}) => {
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
          const yearView = torrent.year && year.toString() != torrent.year && `[${torrent.year}]`;
          return (
            <Fragment key={torrent.magnet + torrent.id + torrent.download}>
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
                  <Actions
                    title={title}
                    backdrop={backdrop}
                    torrent={torrent}
                    provider={provider}
                    onPlay={onPlay}
                    playerEntryId={playerEntryId}
                  />
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
