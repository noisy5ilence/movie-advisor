import { FC } from 'react';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { ArrowDownIcon } from 'lucide-react';

import { Sort } from '@/api/parsers';
import { TableHead } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface Props {
  title: string;
  sort: Sort;
  value: Sort;
  sortable: boolean;
  onChange: (sort: Sort) => void;
}

const TableHeadSortable: FC<Props> = ({ title, sort, value, sortable, onChange }) => {
  const handleSort = !sortable ? undefined : () => onChange(value === Sort.seeds ? Sort.size : Sort.seeds);

  return (
    <TableHead onClick={handleSort} className={cn('select-none px-2', sortable && 'cursor-pointer')}>
      <div className='flex gap-1 items-center'>
        <span>{title}</span>
        {sortable &&
          (sort === value ? <ArrowDownIcon className='ml-2 h-4 w-4' /> : <CaretSortIcon className='ml-2 h-4 w-4' />)}
      </div>
    </TableHead>
  );
};

export default TableHeadSortable;
