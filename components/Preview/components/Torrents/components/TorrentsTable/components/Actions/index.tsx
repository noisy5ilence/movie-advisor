import { FC } from 'react';
import { Cast, ListVideo, Magnet, Play } from 'lucide-react';

import { Quality } from '@/api/parsers/yts/models';
import { Button } from '@/components/ui/button';
import ButtonsGroup from '@/components/ui/buttons-group';
import { cn } from '@/lib/utils';

import { providers } from '../../../../constants';
import { useCastMagnet, usePrefix } from '../../../../hooks/useMagnetHosts';
import showPlayer from '../../../Player';

import useMagnet from './useMagnet';

interface Props {
  torrent: Torrent;
  backdrop: string;
  title: string;
  provider: string;
}

const Actions: FC<Props> = ({ torrent, backdrop, title, provider }) => {
  const prefix = usePrefix();
  const cast = useCastMagnet();
  const { mutateAsync, isPending } = useMagnet();

  const supportedForStream = Boolean(
    (provider === providers.yts.key &&
      torrent.seeders &&
      [Quality.The1080P, Quality.The720P].includes(torrent.quality as Quality)) ||
      torrent.container?.includes('mp4')
  );

  const supportedForCast = prefix && !prefix.includes('{host}');

  const prefetchMagnet = (handler: (magnet: string) => void) => () => {
    if (!torrent.download) return handler(torrent.magnet);

    return mutateAsync(torrent.download).then((magnet) => {
      console.log('magnet', magnet);
      return handler(magnet);
    });
  };

  return (
    <ButtonsGroup className='ml-auto w-fit grow-0'>
      {supportedForStream && (
        <Button
          disabled={isPending}
          variant='destructive'
          className={cn('flex-grow-0 px-3 bg-red-600')}
          onClick={prefetchMagnet((magnet) => showPlayer({ magnet, backdrop, title }))}
          title='Play'
        >
          <Play size={15} />
        </Button>
      )}
      <Button
        disabled={isPending}
        variant='outline'
        className='relative grow-0 px-3'
        title='Play using your native video player'
        onClick={prefetchMagnet((magnet) => {
          window.open(`${process.env.NEXT_PUBLIC_TORRENT_PROXY}/stream?m3u&link=${encodeURIComponent(magnet)}`);
        })}
      >
        <ListVideo size={20} />
      </Button>
      <Button
        disabled={isPending}
        className='relative grow-0 px-3'
        variant='outline'
        onClick={prefetchMagnet((magnet) => window.open(magnet))}
        title='Download magnet'
      >
        <Magnet size={20} />
      </Button>
      {supportedForCast && (
        <Button
          disabled={isPending}
          className='grow-0 px-3'
          variant='outline'
          onClick={prefetchMagnet((magnet) => cast(magnet))}
        >
          <Cast size={20} />
        </Button>
      )}
    </ButtonsGroup>
  );
};

export default Actions;
