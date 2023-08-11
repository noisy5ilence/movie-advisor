import { Dispatch, FC, SetStateAction, useMemo, useState } from 'react';
import { ArrowDownIcon, ArrowUpIcon, CaretSortIcon } from '@radix-ui/react-icons';
import { Loader, Magnet } from 'lucide-react';

import useTorrents from '@/app/(site)/useTorrents';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
  title: string;
  onClose: () => void;
}

type Sorting = {
  by: 'seeders' | 'size';
  direction: 'asc' | 'desc';
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
  onChange,
  value
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
          ...sorting,
          by,
          direction: sorting.by !== by ? 'desc' : sorting.direction === 'asc' ? 'desc' : 'asc'
        }))
      }
      className='cursor-pointer select-none'
    >
      <div className='flex gap-1 items-center'>
        <span>{title}</span>
        {value.by === by &&
          (value.direction === 'desc' ? (
            <ArrowDownIcon className='ml-2 h-4 w-4' />
          ) : (
            <ArrowUpIcon className='ml-2 h-4 w-4' />
          ))}
        {value.by !== by && <CaretSortIcon className='ml-2 h-4 w-4' />}
      </div>
    </TableHead>
  );
};

const Torrents: FC<Props> = ({ title, onClose }) => {
  const { torrents, isLoading, isFetched } = useTorrents({ query: title });
  const [sorting, setSorting] = useState<Sorting>({ by: 'seeders', direction: 'desc' });

  const sortedTorrents = useMemo(() => {
    return [...torrents].sort((a, b) => {
      if (sorting.by === 'size')
        return sorting.direction === 'asc' ? compareSizes(a.size, b.size) : compareSizes(b.size, a.size);

      return sorting.direction === 'asc' ? a.seeders - b.seeders : b.seeders - a.seeders;
    });
  }, [torrents, sorting]);

  return (
    <Dialog defaultOpen={true} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className='p-0'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHeadSortable title='Size' by='size' value={sorting} onChange={setSorting} />
              <TableHeadSortable title='Seeders' by='seeders' value={sorting} onChange={setSorting} />
              <TableHead>Magnet</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTorrents.map((torrent) => (
              <TableRow key={torrent.id}>
                <TableCell>{torrent.title}</TableCell>
                <TableCell>
                  <div className='flex items-center gap-1 shrink-0'>{torrent.size}</div>
                </TableCell>
                <TableCell className='text-center'>{torrent.seeders}</TableCell>
                <TableCell className='text-center'>
                  <a href={torrent.magnetLink} className='flex items-center justify-center h-8 w-8 border rounded-lg'>
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
            {isFetched && !torrents.length && (
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
