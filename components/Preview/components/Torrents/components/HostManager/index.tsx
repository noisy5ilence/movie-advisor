import { useState } from 'react';
import { create, InstanceProps } from 'react-modal-promise';
import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useM3UUrl, useSetM3UUrl } from '@/hooks/useM3UStreamUrl';
import { useSetStreamUrl, useStreamUrl } from '@/hooks/useStreamUrl';

import { usePrefix, useSetPrefix } from '../../hooks/useMagnetHosts';

const showHostManagerModal = create<InstanceProps<string>>(({ onResolve, onReject }) => {
  const [prefix, setPrefix] = useState(usePrefix());
  const submitPrefix = useSetPrefix();
  const [streamUrl, setStreamUrl] = useState(useStreamUrl());
  const submitStreamUrl = useSetStreamUrl();
  const [M3UUrl, setM3UUrl] = useState(useM3UUrl());
  const submitM3UUrl = useSetM3UUrl();

  return (
    <Modal className='m-auto p-2' onClose={onReject}>
      <form
        onSubmit={(event) => {
          event.preventDefault();

          submitStreamUrl(streamUrl);
          submitPrefix(prefix);
          submitM3UUrl(M3UUrl);

          onResolve(prefix);
        }}
      >
        <div className='flex flex-col gap-2'>
          <Input
            autoFocus
            placeholder='Enter address of your torrent streamer'
            value={streamUrl}
            className='h-full'
            onChange={({ target: { value } }) => setStreamUrl(value)}
          />
          <Input
            autoFocus
            placeholder='Enter address of your magnet launcher'
            value={prefix}
            className='h-full'
            onChange={({ target: { value } }) => setPrefix(value)}
          />
          <Input
            autoFocus
            placeholder='Enter address of your M3U handler'
            value={M3UUrl}
            className='h-full'
            onChange={({ target: { value } }) => setM3UUrl(value)}
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
