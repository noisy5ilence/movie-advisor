import React, { Fragment, useState } from 'react';
import { create, InstanceProps } from 'react-modal-promise';
import { Cast, Copy, ListVideo, Loader, Magnet, Play } from 'lucide-react';

import { Sort } from '@/api/parsers';
import { Quality } from '@/api/parsers/yts/models';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCastMagnet, usePrefix } from '@/hooks/useMagnetHosts';

import showPlayer from './components/Player';
import TableHeadSortable from './components/TableHeadSortable';
import { providers } from './constants';
import showHostManagerModal from './HostManager';
import useTorrents from './useTorrents';

interface Props extends InstanceProps<void> {
  imdbID: string;
  title: string;
  year: number;
  backdrop: string;
}

const showTorrentsModal = create(({ title, year, imdbID, backdrop, onResolve }: Props) => {
  const prefix = usePrefix();
  const [sort, setSort] = useState<Sort>(Sort.seeds);
  const [withYear, setWithYear] = useState(true);
  const [{ key, queryFn, sortable }, setProvider] = useState(providers.yts);

  const query = key === providers.yts.key ? title : withYear ? `${title} ${year || ''}` : title;

  const {
    data: torrents,
    isLoading,
    isFetching,
    isFetched
  } = useTorrents({
    query,
    sort,
    imdbID,
    key,
    queryFn
  });

  const cast = useCastMagnet();

  const colSpan = 5;

  return (
    <Modal className='p-0 pb-1' onClose={onResolve}>
      <Table className='overflow-hidden rounded-xl'>
        <TableHeader>
          <TableRow className='!border-b-0'>
            <TableHead className='px-2' colSpan={colSpan}>
              <div className='grid grid-cols-[1fr_auto] items-center gap-3'>
                <span className='truncate text-base'>{title}</span>
                <Button
                  className='h-6 p-2'
                  variant={withYear ? 'default' : 'ghost'}
                  onClick={() => setWithYear((withYear) => !withYear)}
                >
                  {year}
                </Button>
              </div>
            </TableHead>
          </TableRow>
          <TableRow className='!border-b-0'>
            <th colSpan={colSpan}>
              <Tabs defaultValue={key} value={key} className='w-full rounded-none'>
                <TabsList className='grid w-full grid-cols-2'>
                  {Object.values(providers).map((provider) => (
                    <TabsTrigger key={provider.key} value={provider.key} onClick={() => setProvider(provider)}>
                      {provider.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </th>
          </TableRow>
          <TableRow>
            <TableHead className='hidden px-2 md:table-cell'>Title</TableHead>
            <TableHead className='hidden px-2 md:table-cell'>Resolution</TableHead>
            <TableHeadSortable sortable={sortable} title='Size' sort={Sort.size} value={sort} onChange={setSort} />
            <TableHeadSortable
              sortable={sortable}
              title='Seeders'
              className='max-w-10'
              sort={Sort.seeds}
              value={sort}
              onChange={setSort}
            />
            <TableHead className='cursor-pointer select-none px-2' onClick={() => showHostManagerModal()} />
          </TableRow>
        </TableHeader>

        <TableBody>
          {torrents?.map((torrent) => {
            const supportedForStream = Boolean(
              (key === providers.yts.key &&
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

          {(isLoading || isFetching) && (
            <TableRow>
              <TableCell colSpan={colSpan}>
                <div className='flex h-40 w-full items-center justify-center'>
                  <Loader className='animate-spin' />
                </div>
              </TableCell>
            </TableRow>
          )}

          {!(isLoading || isFetching) && isFetched && !torrents?.length && (
            <TableRow>
              <TableCell colSpan={colSpan}>
                <div className='flex h-40 w-full items-center justify-center text-xl text-muted-foreground'>
                  Nothing was found
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Modal>
  );
});

export default showTorrentsModal;
