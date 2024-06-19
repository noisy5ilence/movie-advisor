import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { create, InstanceProps } from 'react-modal-promise';
import { ArrowDownIcon, CaretSortIcon } from '@radix-ui/react-icons';
import { Cast, Loader, Magnet } from 'lucide-react';

import useTorrents from '@/app/(site)/useTorrents';
import { Modal } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Toggle } from '@/components/ui/toggle';
import { useCastMagnet, useHost, useSetHost } from '@/hooks/useMagnetHosts';
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
      <div className='flex gap-1 items-center justify-center'>
        <span>{title}</span>
        {value.by === by ? <ArrowDownIcon className='ml-2 h-4 w-4' /> : <CaretSortIcon className='ml-2 h-4 w-4' />}
      </div>
    </TableHead>
  );
};

const Torrents: FC<Props> = ({ title, year, onResolve }) => {
  const host = useHost();
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
              {title}{' '}
              <Toggle
                size='sm'
                className='p-2 h-7'
                pressed={withYear}
                onClick={() => setWithYear((withYear) => !withYear)}
              >
                {year}
              </Toggle>
            </TableHead>
          </TableRow>
          <TableRow>
            <TableHead className='px-2'>Title</TableHead>
            <TableHeadSortable title='Size' by={ORDER.size} value={sorting} onChange={setSorting} />
            <TableHeadSortable title='Seeders' by={ORDER.seeders} value={sorting} onChange={setSorting} />
            <TableHead className='px-2 text-center cursor-pointer select-none' onClick={() => showHostManagerModal()}>
              Magnet
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {torrents?.map((torrent) => (
            <TableRow key={torrent.magnet + torrent.id}>
              <TableCell className='break-all p-2'>{torrent.title}</TableCell>
              <TableCell className='p-2'>
                <div className='flex items-center gap-1 shrink-0 justify-center'>{torrent.size}</div>
              </TableCell>
              <TableCell className='text-center p-2'>{torrent.seeders}</TableCell>
              <TableCell className='text-center p-1'>
                <div className='flex gap-2 m-auto justify-center'>
                  {host ? (
                    <a
                      onClick={(event) => {
                        event.preventDefault();
                        cast(torrent.magnet!);
                      }}
                      className='flex items-center justify-center h-8 w-8 border rounded-lg'
                    >
                      <Cast size={20} />
                    </a>
                  ) : (
                    <a href={torrent.magnet} className='flex items-center justify-center h-8 w-8 border rounded-lg'>
                      <Magnet size={20} />
                    </a>
                  )}
                </div>
              </TableCell>
            </TableRow>
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
