'use client';

import { useState } from 'react';
import { create, InstanceProps } from 'react-modal-promise';
import { Loader } from 'lucide-react';
import { BigPlayButton, ClosedCaptionButton, ControlBar, Player } from 'video-react';

import { Modal } from '@/components/ui/dialog';
import { useToast } from '@/hooks/useToast';

import showFiles from './components/Files';
import useFiles from './useFiles';

interface Props extends InstanceProps<void> {
  magnet: string;
}

const showPlayer = create(({ onResolve, magnet }: Props) => {
  const [source, setSource] = useState<string | null>(null);
  const { toast } = useToast();

  const { data, isFetched } = useFiles({
    magnet,
    onSuccess(files) {
      if (!files.length) {
        toast({ title: 'This torrent doesn\'t contain any compatible video files' });
        return onResolve();
      }

      if (files.length === 1) {
        const [file] = files;

        return setSource(file.src);
      }

      showFiles({ files }).then((file) => setSource(file.src));
    }
  });

  return (
    <Modal
      className='p-0 border-none rounded-lg overflow-hidden flex items-center justify-center relative'
      style={{ aspectRatio: '16/9' }}
      onClose={onResolve}
    >
      <Player autoPlay aspectRatio='16:9'>
        {!isFetched && (
          <>
            <div className='w-full h-full left-0 top-0 absolute flex items-center justify-center'>
              <div className='animate-spin'>
                <Loader color='white' />
              </div>
            </div>
          </>
        )}
        {source && <source src={source} />}
        {isFetched &&
          data?.map((file) =>
            file.subtitles.map(({ name, content }) => (
              <track
                key={name}
                kind='captions'
                src={URL.createObjectURL(new Blob([content], { type: 'text/vtt' }))}
                label={name}
              />
            ))
          )}
        <ControlBar autoHide={false}>
          <ClosedCaptionButton order={7} />
        </ControlBar>
        <BigPlayButton position='center' />
      </Player>
    </Modal>
  );
});

export default showPlayer;
