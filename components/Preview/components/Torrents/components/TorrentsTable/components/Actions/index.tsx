import { FC } from 'react';
import { Cast, Download, ListVideo, Loader, Magnet, Play } from 'lucide-react';

import { Button } from '@/components/ui/button';
import ButtonsGroup from '@/components/ui/buttons-group';
import { Quality } from '@/data/parsers/yts/models';
import { STREAM_URL } from '@/env';
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

  const supportedForStream = Boolean(
    (provider === providers.yts.key &&
      torrent.seeders &&
      [Quality.The1080P, Quality.The720P].includes(torrent.quality as Quality)) ||
      torrent.container?.includes('mp4')
  );

  const fetchMagnet = useMagnet(torrent);

  const magnet = fetchMagnet.data || torrent.magnet;

  const supportedForCast = prefix && !prefix.includes('{host}');

  return (
    <div className='relative ml-auto w-fit grow-0'>
      <ButtonsGroup>
        {supportedForStream && (
          <Button
            variant='destructive'
            className={cn(
              'flex-grow-0 px-3 bg-red-600',
              'hover:shadow-lg hover:shadow-red-600/60 duration-200 transition-all hover:bg-red-600'
            )}
            onClick={() => showPlayer({ magnet, backdrop, title })}
            title='Play'
          >
            <Play size={15} />
          </Button>
        )}
        <Button variant='outline' className='relative grow-0 px-3' title='Download m3u playlist'>
          <a
            className='absolute left-0 top-0 size-full'
            target='_blank'
            rel='noopener noreferrer'
            href={`${STREAM_URL}?m3u&link=${encodeURIComponent(magnet)}`}
          />
          <ListVideo size={20} />
        </Button>
        <Button className='relative grow-0 px-3' variant='outline' title='Download magnet'>
          <a className='absolute left-0 top-0 size-full' target='_blank' rel='noopener noreferrer' href={magnet} />
          <Magnet size={20} />
        </Button>
        {supportedForCast && (
          <Button className='grow-0 px-3' variant='outline' onClick={() => cast(magnet)}>
            <Cast size={20} />
          </Button>
        )}
      </ButtonsGroup>
      {!magnet && (
        <Button
          title='Fetch files'
          variant='outline'
          disabled={fetchMagnet.isPending}
          onClick={() => fetchMagnet.mutate()}
          className={cn('z-10 h-8 absolute size-full left-0 top-0 rounded-md disabled:opacity-100')}
        >
          {fetchMagnet.isPending ? (
            <div className='animate-spin'>
              <Loader size={18} />
            </div>
          ) : (
            <Download size={18} />
          )}
        </Button>
      )}
    </div>
  );
};

export default Actions;
