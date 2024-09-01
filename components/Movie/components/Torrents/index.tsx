import React, { Dispatch, FC, Fragment, SetStateAction, useState } from 'react';
import { create, InstanceProps } from 'react-modal-promise';
import { ArrowDownIcon, CaretSortIcon } from '@radix-ui/react-icons';
import { Cast, Copy,Loader, Magnet } from 'lucide-react';

import useTorrents from '@/app/(site)/useTorrents';
import { Modal } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Toggle } from '@/components/ui/toggle';
import { useCastMagnet, usePrefix } from '@/hooks/useMagnetHosts';
import { ORDER } from '@/lib/api/parsers/pirate-bay';

import showHostManagerModal from './HostManager';

interface Props extends InstanceProps<void> {
  title: string;
  year: number;
}

type Sorting = {
  by: ORDER;
};

const TableHeadSortable = ({
  title,
  by,
  value,
  onChange
}: {
  title: string;
  by: Sorting['by'];
  value: Sorting;
  onChange: Dispatch<SetStateAction<Sorting>>;
}) => {
  return (
    <TableHead
      onClick={() =>
        onChange((sorting) => ({
          by: sorting.by === ORDER.seeders ? ORDER.size : ORDER.seeders
        }))
      }
      className='cursor-pointer select-none px-2'
    >
      <div className='flex gap-1 items-center'>
        <span>{title}</span>
        {value.by === by ? <ArrowDownIcon className='ml-2 h-4 w-4' /> : <CaretSortIcon className='ml-2 h-4 w-4' />}
      </div>
    </TableHead>
  );
};

const Torrents: FC<Props> = ({ title, year, onResolve }) => {
  const isMobile = matchMedia('(max-width: 600px)').matches;
  const prefix = usePrefix();
  const [sorting, setSorting] = useState<Sorting>({ by: ORDER.seeders });
  const [withYear, setWithYear] = useState(true);

  const {
    data: torrents,
    isLoading,
    isFetched
  } = useTorrents({ query: withYear ? `${title} ${year || ''}` : title, order: sorting.by });

  const cast = useCastMagnet();

  return (
    <Modal className='p-0' onClose={onResolve}>
      <Table className='rounded-xl overflow-hidden'>
        <TableHeader>
          <TableRow>
            <TableHead className='px-2' colSpan={4}>
              <div className='grid grid-cols-[1fr_auto] items-center gap-3'>
                <span className='overflow-ellipsis overflow-hidden text-base whitespace-nowrap'>{title}</span>
                <Toggle
                  size='sm'
                  className='p-2 h-7'
                  pressed={withYear}
                  onClick={() => setWithYear((withYear) => !withYear)}
                >
                  {year}
                </Toggle>
              </div>
            </TableHead>
          </TableRow>
          <TableRow>
            {!isMobile && <TableHead className='px-2'>Title</TableHead>}
            <TableHeadSortable title='Size' by={ORDER.size} value={sorting} onChange={setSorting} />
            <TableHeadSortable title='Seeders' by={ORDER.seeders} value={sorting} onChange={setSorting} />
            <TableHead className='px-2 cursor-pointer select-none' onClick={() => showHostManagerModal()} />
          </TableRow>
        </TableHeader>
        <TableBody>
          {torrents?.map((torrent) => (
            <Fragment key={torrent.magnet + torrent.id}>
              {isMobile && (
                <TableRow className='border-b-0'>
                  <TableCell className='break-all p-2' colSpan={4}>
                    {torrent.title}
                  </TableCell>
                </TableRow>
              )}
              <TableRow>
                {!isMobile && <TableCell className='break-all p-2'>{torrent.title}</TableCell>}
                <TableCell className='p-2'>
                  <div className='flex items-center gap-1 shrink-0'>{torrent.size}</div>
                </TableCell>
                <TableCell className='p-2'>{torrent.seeders}</TableCell>
                <TableCell className='text-center p-1 pr-2'>
                  <div className='flex gap-2 justify-end'>
                    <a href={torrent.magnet} className='flex items-center justify-center h-8 w-8 border rounded-lg'>
                      <Magnet size={20} />
                    </a>
                    <div
                      className='flex items-center justify-center h-8 w-8 border rounded-lg cursor-pointer'
                      onClick={() => navigator.clipboard.writeText(torrent.magnet)}
                    >
                      <Copy size={20} />
                    </div>
                    {prefix && !prefix.includes('{host}') && (
                      <div
                        onClick={() => cast(torrent.magnet!)}
                        className='flex items-center justify-center h-8 w-8 border rounded-lg cursor-pointer'
                      >
                        <Cast size={20} />
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            </Fragment>
          ))}
          {isLoading && (
            <TableRow>
              <TableCell colSpan={4}>
                <div className='h-40 w-full flex items-center justify-center'>
                  <Loader className='animate-spin' />
                </div>
              </TableCell>
            </TableRow>
          )}
          {isFetched && !torrents?.length && (
            <TableRow>
              <TableCell colSpan={4}>
                <div className='h-40 w-full flex items-center justify-center text-xl text-muted-foreground'>
                  Nothing was found
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Modal>
  );
};

export const showTorrentsModal = create(Torrents);

export default Torrents;
