import React, { Fragment, useState } from 'react';
import { create, InstanceProps } from 'react-modal-promise';
import { Cast, Copy, Loader, Magnet, Play } from 'lucide-react';

import { Sort } from '@/api/parsers';
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
  const isMobile = matchMedia('(max-width: 600px)').matches;
  const prefix = usePrefix();
  const [sort, setSort] = useState<Sort>(Sort.seeds);
  const [withYear, setWithYear] = useState(true);
  const [{ key, queryFn, sortable }, setProvider] = useState(providers.yts);

  const query = key === providers.yts.key ? title : withYear ? `${title} ${year || ''}` : title;

  const {
    data: torrents,
    isLoading,
    isFetched
  } = useTorrents({
    query,
    sort,
    imdbID,
    key,
    queryFn
  });

  const cast = useCastMagnet();

  return (
    <Modal className='p-0' onClose={onResolve}>
      <Table className='overflow-hidden rounded-xl'>
        <TableHeader>
          <TableRow className='!border-b-0'>
            <TableHead className='px-2' colSpan={4}>
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
            <th colSpan={5}>
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
            {!isMobile && <TableHead className='px-2'>Title</TableHead>}
            <TableHeadSortable sortable={sortable} title='Size' sort={Sort.size} value={sort} onChange={setSort} />
            <TableHeadSortable sortable={sortable} title='Seeders' sort={Sort.seeds} value={sort} onChange={setSort} />
            <TableHead className='cursor-pointer select-none px-2' onClick={() => showHostManagerModal()} />
          </TableRow>
        </TableHeader>
        <TableBody>
          {torrents?.map((torrent) => {
            const supportedForStream = Boolean(
              key === providers.yts.key &&
                torrent.seeders &&
                ['720p', '1080p'].some((resolution) => torrent.title.includes(resolution))
            );

            return (
              <Fragment key={torrent.magnet + torrent.id}>
                {isMobile && (
                  <TableRow className='border-b-0'>
                    <TableCell className='break-all p-2' colSpan={4}>
                      {torrent.title}
                    </TableCell>
                  </TableRow>
                )}
                <TableRow>
                  {!isMobile && (
                    <TableCell className='break-all p-2'>
                      {torrent.title} {torrent.type && `[${torrent.type?.toUpperCase()}]`}
                    </TableCell>
                  )}
                  <TableCell className='p-2'>
                    <div className='flex shrink-0 items-center gap-1'>{torrent.size}</div>
                  </TableCell>
                  <TableCell className='p-2'>{torrent.seeders}</TableCell>
                  <TableCell className='p-1 pr-2 text-center'>
                    <div className='flex justify-end gap-2'>
                      {supportedForStream && (
                        <div
                          className='flex size-8 cursor-pointer items-center justify-center rounded-lg border'
                          onClick={() => showPlayer({ magnet: torrent.magnet, backdrop })}
                        >
                          <Play size={20} />
                        </div>
                      )}
                      <a href={torrent.magnet} className='flex size-8 items-center justify-center rounded-lg border'>
                        <Magnet size={20} />
                      </a>
                      <div
                        className='flex size-8 cursor-pointer items-center justify-center rounded-lg border'
                        onClick={() => navigator.clipboard.writeText(torrent.magnet)}
                      >
                        <Copy size={20} />
                      </div>
                      {prefix && !prefix.includes('{host}') && (
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
          {isLoading && (
            <TableRow>
              <TableCell colSpan={4}>
                <div className='flex h-40 w-full items-center justify-center'>
                  <Loader className='animate-spin' />
                </div>
              </TableCell>
            </TableRow>
          )}
          {!isLoading && isFetched && !torrents?.length && (
            <TableRow>
              <TableCell colSpan={4}>
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
