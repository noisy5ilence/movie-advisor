import { create, InstanceProps } from 'react-modal-promise';
import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import ButtonsGroup from '@/components/ui/buttons-group';
import { Modal } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import { usePrefix, useSetPrefix } from '../../hooks/useMagnetHosts';

const showHostManagerModal = create<InstanceProps<string>>(({ onResolve, onReject }) => {
  const prefix = usePrefix();
  const setPrefix = useSetPrefix();

  return (
    <Modal className='m-auto p-2' onClose={onReject}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onResolve(prefix);
        }}
      >
        <ButtonsGroup className='h-10'>
          <Input
            autoFocus
            placeholder='Enter address of your torrents streamer'
            value={prefix}
            className='h-full'
            onChange={({ target: { value } }) => setPrefix(value)}
          />
          <Button
            type='submit'
            className='h-full !px-3 transition-all duration-200 hover:bg-secondary-foreground hover:shadow-lg hover:shadow-secondary-foreground/60'
          >
            <Check size={16} />
          </Button>
        </ButtonsGroup>
      </form>
    </Modal>
  );
});

export default showHostManagerModal;
