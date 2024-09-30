import { create, InstanceProps } from 'react-modal-promise';

import { Modal } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { usePrefix, useSetPrefix } from '@/hooks/useMagnetHosts';

const showHostManagerModal = create<InstanceProps<string>>(({ onResolve, onReject }) => {
  const prefix = usePrefix();
  const setPrefix = useSetPrefix();

  return (
    <Modal className='p-2 max-w-[200px] m-auto' onClose={onReject}>
      <Input
        autoFocus
        placeholder='Enter address of your torrents streamer'
        value={prefix}
        className='focus-visible:ring-0'
        onChange={({ target: { value } }) => setPrefix(value)}
        onKeyDown={({ key }) => key === 'Enter' && onResolve(prefix)}
      />
    </Modal>
  );
});

export default showHostManagerModal;
