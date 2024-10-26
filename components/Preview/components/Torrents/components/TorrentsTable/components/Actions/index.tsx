import { FC } from 'react';
import { Cast, ListVideo, Magnet, Play } from 'lucide-react';

import { Quality } from '@/api/parsers/yts/models';
import { Button } from '@/components/ui/button';
import ButtonsGroup from '@/components/ui/buttons-group';
import { cn } from '@/lib/utils';

import { providers } from '../../../../constants';
import { useCastMagnet, usePrefix } from '../../../../hooks/useMagnetHosts';
import showPlayer from '../../../Player';

interface Props {
  torrent: Torrent;
  backdrop: string;
  title: string;
  provider: string;
}

const Actions: FC<Props> = ({ torrent, backdrop, title, provider }) => {
  const prefix = usePrefix();
  const cast = useCastMagnet();

  const supportedForStream = Boolean(
    (provider === providers.yts.key &&
      torrent.seeders &&
      [Quality.The1080P, Quality.The720P].includes(torrent.quality as Quality)) ||
      torrent.container?.includes('mp4')
  );

  const supportedForCast = prefix && !prefix.includes('{host}');

  return (
    <ButtonsGroup className='ml-auto w-fit grow-0'>
      {supportedForStream && (
        <Button
          variant='destructive'
          className={cn('flex-grow-0 px-3 bg-red-600')}
          onClick={() => showPlayer({ magnet: torrent.download || torrent.magnet, backdrop, title })}
          title='Play'
        >
          <Play size={15} />
        </Button>
      )}
      <Button variant='outline' className='relative grow-0 px-3' title='Play using your native video player'>
        <a
          className='absolute left-0 top-0 size-full'
          href={`${process.env.NEXT_PUBLIC_TORRENT_PROXY}/stream?m3u&link=${encodeURIComponent(
            torrent.download || torrent.magnet
          )}`}
        />
        <ListVideo size={20} />
      </Button>
      <Button
        className='relative grow-0 px-3'
        variant='outline'
        title={`Download ${torrent.download ? 'torrent' : 'magnet'}`}
      >
        <a className='absolute left-0 top-0 size-full' href={torrent.download || torrent.magnet} />
        <Magnet size={20} />
      </Button>
      {supportedForCast && (
        <Button className='grow-0 px-3' variant='outline' onClick={() => cast(torrent.download || torrent.magnet)}>
          <Cast size={20} />
        </Button>
      )}
    </ButtonsGroup>
  );
};

export default Actions;
