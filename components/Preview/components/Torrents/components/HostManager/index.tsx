import { useState } from 'react';
import { create, InstanceProps } from 'react-modal-promise';
import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useSetStreamUrl, useStreamUrl } from '@/hooks/useStreamUrl';

import { usePrefix, useSetPrefix } from '../../hooks/useMagnetHosts';

const showHostManagerModal = create<InstanceProps<string>>(({ onResolve, onReject }) => {
  const [prefix, setPrefix] = useState(usePrefix());
  const submitPrefix = useSetPrefix();
  const [streamUrl, setStreamUrlValue] = useState(useStreamUrl());
  const submitStreamUrl = useSetStreamUrl();

  return (
    <Modal className='m-auto p-2' onClose={onReject}>
      <form
        onSubmit={(event) => {
          event.preventDefault();

          submitStreamUrl(streamUrl);
          submitPrefix(prefix);

          onResolve(prefix);
        }}
      >
        <div className='flex flex-col gap-2'>
          <Input
            autoFocus
            placeholder='Enter address of your torrent streamer'
            value={streamUrl}
            className='h-full'
            onChange={({ target: { value } }) => setStreamUrlValue(value)}
          />
          <Input
            autoFocus
            placeholder='Enter address of your magnet launcher'
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
        </div>
      </form>
    </Modal>
  );
});

export default showHostManagerModal;
