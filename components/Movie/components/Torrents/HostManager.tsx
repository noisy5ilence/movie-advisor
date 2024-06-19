import { create, InstanceProps } from 'react-modal-promise';

import { Modal } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useHost, useSetHost } from '@/hooks/useMagnetHosts';

const showHostManagerModal = create<InstanceProps<string>>(({ onResolve, onReject }) => {
  const host = useHost();
  const setHost = useSetHost();
  return (
    <Modal className='p-2 max-w-[200px] m-auto' onClose={onReject}>
      <Input
        autoFocus
        placeholder='Enter host of Elementum'
        value={host}
        className='focus-visible:ring-0'
        onChange={({ target: { value } }) => setHost(value)}
        onKeyDown={({ key }) => key === 'Enter' && onResolve(host)}
      />
    </Modal>
  );
});

export default showHostManagerModal;
