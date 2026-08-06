import { FC, Fragment, useState } from 'react';
import { ArrowDownIcon } from 'lucide-react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sort } from '@/data/parsers';
import { cn } from '@/lib/utils';

import showHostManagerModal from '../HostManager';
import TableHeadSortable from '../TableHeadSortable';

import Actions from './components/Actions';

type EpisodesSort = 'asc' | 'desc';

// "S3:E7/8" -> [3, 7]; "S1-9" -> [1, 0]; missing info sorts last
const seasonEpisode = (episodes?: string): [number, number] => [
  Number(episodes?.match(/S(\d+)/)?.[1] ?? 9999),
  Number(episodes?.match(/E(\d+)/)?.[1] ?? 0)
];

type Props = {
  show: Show & Partial<Details>;
  title: string;
  torrents: Torrent[];
  sort: Sort;
  sortable: boolean;
  provider: string;
  onChangeSort: (sort: Sort) => void;
};

const TorrentsTable: FC<Props> = ({ title, torrents, show, sort, sortable, provider, onChangeSort }) => {
  const isSeries = show.type === 'tv';
  const colSpan = 7;

  const [episodesSort, setEpisodesSort] = useState<EpisodesSort | null>(null);

  const rows = episodesSort
    ? [...torrents].sort((a, b) => {
        const [seasonA, episodeA] = seasonEpisode(a.episodes);
        const [seasonB, episodeB] = seasonEpisode(b.episodes);
        const diff = seasonA - seasonB || episodeA - episodeB;

        return episodesSort === 'asc' ? diff : -diff;
      })
    : torrents;

  // server sort (size/seeds) refetches in a new order, so drop the client-side S:E sort
  const handleChangeSort = (next: Sort) => {
    setEpisodesSort(null);
    onChangeSort(next);
  };

  const toggleEpisodesSort = () => setEpisodesSort((current) => (current === 'asc' ? 'desc' : 'asc'));

  return (
    <Table className='overflow-hidden rounded-xl'>
      {Boolean(torrents?.length) && (
        <TableHeader>
          <TableRow className='hover:bg-transparent'>
            <TableHead className='hidden px-2 md:table-cell'>Title</TableHead>
            {isSeries && (
              <TableHead className='hidden cursor-pointer select-none px-2 md:table-cell' onClick={toggleEpisodesSort}>
                <div className='flex items-center gap-1'>
                  <span>S:E</span>
                  {episodesSort && (
                    <ArrowDownIcon className={cn('ml-2 size-4 shrink-0', episodesSort === 'asc' && 'rotate-180')} />
                  )}
                </div>
              </TableHead>
            )}
            <TableHead className='hidden px-2 lg:table-cell'>Year</TableHead>
            <TableHead className='hidden px-2 md:table-cell'>Resolution</TableHead>
            <TableHeadSortable
              sortable={sortable}
              title='Size'
              sort={Sort.size}
              value={sort}
              onChange={handleChangeSort}
            />
            <TableHeadSortable
              sortable={sortable}
              title='Seeders'
              className='max-w-10'
              sort={Sort.seeds}
              value={sort}
              onChange={handleChangeSort}
            />
            <TableHead className='cursor-pointer select-none px-2' onClick={() => showHostManagerModal()} />
          </TableRow>
        </TableHeader>
      )}

      <TableBody>
        {rows?.map((torrent) => {
          return (
            <Fragment key={torrent.magnet + torrent.id + torrent.download}>
              <TableRow className='table-row border-b-0 hover:bg-transparent md:hidden'>
                <TableCell className='break-all p-2' colSpan={colSpan}>
                  <span className='flex w-full flex-wrap items-center gap-3'>
                    {torrent.title} {isSeries && torrent.episodes && `[${torrent.episodes}]`}{' '}
                    {torrent.quality && `[${torrent.quality}]`}
                  </span>
                </TableCell>
              </TableRow>
              <TableRow className='hover:bg-transparent'>
                <TableCell className='hidden break-all p-2 md:table-cell' title={torrent.originalTitle}>
                  {torrent.title}
                </TableCell>
                {isSeries && (
                  <TableCell className='hidden p-2 md:table-cell'>
                    <div className='flex shrink-0 items-center gap-1'>{torrent.episodes}</div>
                  </TableCell>
                )}
                <TableCell className='hidden p-2 lg:table-cell'>
                  <div className='flex shrink-0 items-center gap-1'>{torrent.year}</div>
                </TableCell>
                <TableCell className='hidden p-2 md:table-cell'>
                  <div className='flex shrink-0 items-center gap-1'>{torrent.quality}</div>
                </TableCell>
                <TableCell className='truncate p-2'>
                  <div className='flex shrink-0 items-center gap-1'>{torrent.size}</div>
                </TableCell>
                <TableCell className='truncate p-2'>{torrent.seeders}</TableCell>
                <TableCell className='p-1 pr-2 text-center'>
                  <Actions show={show} title={title} torrent={torrent} provider={provider} />
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
