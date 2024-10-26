import { FC } from 'react';
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
  className?: string;
}

const TableHeadSortable: FC<Props> = ({ title, sort, value, sortable, className, onChange }) => {
  const handleSort = !sortable ? undefined : () => onChange(value === Sort.seeds ? Sort.size : Sort.seeds);

  return (
    <TableHead onClick={handleSort} className={cn('select-none px-2', sortable && 'cursor-pointer', className)}>
      <div className='flex items-center gap-1'>
        <span>{title}</span>
        {sortable && sort === value && <ArrowDownIcon className='ml-2 size-4 shrink-0' />}
      </div>
    </TableHead>
  );
};

export default TableHeadSortable;
