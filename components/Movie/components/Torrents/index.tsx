import { Dispatch, FC, SetStateAction, useState } from 'react';
import { ArrowDownIcon, CaretSortIcon } from '@radix-ui/react-icons';
import { Loader, Magnet } from 'lucide-react';

import useTorrents from '@/app/(site)/useTorrents';
import { ORDER } from '@/app/api/torrents/parsers/pirate-bay';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
  title: string;
  onClose: () => void;
}

type Sorting = {
  by: ORDER;
};

function convertToBytes(size: string) {
  const units: Record<string, number> = { B: 1, KiB: 1024, MiB: 1024 * 1024, GiB: 1024 * 1024 * 1024 };
  const [value, unit] = size.split(' ');
  return parseFloat(value) * units[unit];
}

function compareSizes(size1: string, size2: string) {
  return convertToBytes(size1) - convertToBytes(size2);
}

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

const Torrents: FC<Props> = ({ title, onClose }) => {
  const [sorting, setSorting] = useState<Sorting>({ by: ORDER.seeders });
  const { data: torrents, isLoading, isFetched } = useTorrents({ query: title, order: sorting.by });

  return (
    <Dialog defaultOpen={true} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className='p-0'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='px-2'>Title</TableHead>
              <TableHeadSortable title='Size' by={ORDER.size} value={sorting} onChange={setSorting} />
              <TableHeadSortable title='Seeders' by={ORDER.seeders} value={sorting} onChange={setSorting} />
              <TableHead className='px-2 text-center'>Magnet</TableHead>
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
                  <a
                    href={torrent.magnet}
                    className='flex f-full items-center justify-center h-8 w-8 m-auto border rounded-lg'
                  >
                    <Magnet size={20} />
                  </a>
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
      </DialogContent>
    </Dialog>
  );
};

export default Torrents;
