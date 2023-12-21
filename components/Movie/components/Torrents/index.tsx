import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { ArrowDownIcon, CaretSortIcon } from '@radix-ui/react-icons';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { Cast, Loader, Magnet } from 'lucide-react';

import useTorrents from '@/app/(site)/useTorrents';
import { ORDER } from '@/app/api/torrents/parsers/pirate-bay';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
  title: string;
  onClose: () => void;
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

const hostAtom = atomWithStorage<string>('magnet-host', '');

const Torrents: FC<Props> = ({ title, onClose }) => {
  const [host, setHost] = useAtom(hostAtom);
  const [isShowHostInput, setIsShowHostInput] = useState(false);
  const [sorting, setSorting] = useState<Sorting>({ by: ORDER.seeders });

  const { data: torrents, isLoading, isFetched } = useTorrents({ query: title, order: sorting.by });

  const handleCast = (magnet: string) => (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();

    const link = window.open(`http://${host}:65220/playuri?uri=${magnet}`, '_blank');
    setTimeout(() => link?.close(), 100);
  };

  return (
    <Dialog defaultOpen={true} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className='p-0' onClose={onClose}>
        <Table className='rounded-xl overflow-hidden'>
          <TableHeader>
            <TableRow>
              <TableHead className='px-2'>Title</TableHead>
              <TableHeadSortable title='Size' by={ORDER.size} value={sorting} onChange={setSorting} />
              <TableHeadSortable title='Seeders' by={ORDER.seeders} value={sorting} onChange={setSorting} />
              <TableHead className='px-2 text-center' onClick={() => setIsShowHostInput(true)}>
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
                        onClick={handleCast(torrent.magnet)}
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
        {isShowHostInput && (
          <Dialog defaultOpen={true} onOpenChange={() => setIsShowHostInput(false)}>
            <DialogContent className='flex p-3 max-w-[300px] gap-2' onClose={() => setIsShowHostInput(false)}>
              <Input
                autoFocus
                placeholder='Enter host of Elementum'
                value={host}
                onChange={({ target: { value } }) => setHost(value)}
                onKeyDown={({ key }) => key === 'Enter' && setIsShowHostInput(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Torrents;
