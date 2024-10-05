'use client';

import { useEffect, useState } from 'react';
import { create, InstanceProps } from 'react-modal-promise';
import { Loader } from 'lucide-react';
import { BigPlayButton, ClosedCaptionButton, ControlBar, Player, PlayerReference } from 'video-react';

import { Modal } from '@/components/ui/dialog';
import { useToast } from '@/hooks/useToast';

import useSubtitles from './useSubtitles';

interface Props extends InstanceProps<void> {
  magnet: string;
  backdrop: string;
}

type PlayerRef = PlayerReference & { video: { video: HTMLVideoElement } };

const showPlayer = create(({ onResolve, magnet, backdrop }: Props) => {
  const [player, setPlayer] = useState<PlayerRef | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { data: subtitles } = useSubtitles({ magnet });

  useEffect(() => {
    if (!player) return;

    const { video } = player.video;

    const handleCanPlay = () => setIsLoading(false);

    video.addEventListener('canplay', handleCanPlay);

    return () => video.removeEventListener('canplay', handleCanPlay);
  }, [player]);

  return (
    <Modal
      className='relative flex items-center justify-center overflow-hidden rounded-lg border-none p-0'
      style={{ aspectRatio: '16/9' }}
      onClose={onResolve}
    >
      <Player autoPlay aspectRatio='16:9' poster={backdrop} ref={(player) => setPlayer(player as PlayerRef)}>
        {subtitles?.map(({ name, content }) => (
          <track
            key={name}
            kind='captions'
            src={URL.createObjectURL(new Blob([content], { type: 'text/vtt' }))}
            label={name}
          />
        ))}
        <source
          src={`${process.env.NEXT_PUBLIC_TRACKER_PROXY_BASE}/stream?magnet=${encodeURIComponent(magnet)}`}
          onError={() => {
            toast({ title: 'This torrent doesn\'t contain any compatible video files' });
            setIsLoading(false);
          }}
        />
        <ControlBar>{Boolean(subtitles?.length) && <ClosedCaptionButton order={7} />}</ControlBar>
        <BigPlayButton position='center' />
      </Player>
      {isLoading && (
        <>
          <div className='absolute left-0 top-0 flex size-full items-center justify-center bg-black/70'>
            <div className='animate-spin'>
              <Loader color='white' />
            </div>
          </div>
        </>
      )}
    </Modal>
  );
});

export default showPlayer;
