import { create, InstanceProps } from 'react-modal-promise';

import { Modal } from '@/components/ui/dialog';
import { Table, TableBody, TableCaption, TableCell, TableRow } from '@/components/ui/table';

interface Props extends InstanceProps<Source> {
  files: Source[];
}

const showFiles = create(({ onResolve, onReject, files }: Props) => {
  return (
    <Modal className='p-0 max-w-[500px]' onClose={onReject}>
      <Table className='rounded-xl overflow-hidden'>
        <TableCaption className='caption-top mt-2'>Choose file to play</TableCaption>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.name} className='cursor-pointer'>
              <TableCell className='p-2 cursor-pointer' onClick={() => onResolve(file)}>
                {file.name}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Modal>
  );
});

export default showFiles;
