import { FC, useMemo } from 'react';
import { Cast, Download, ListVideo, Loader, Magnet, Play } from 'lucide-react';

import { Button } from '@/components/ui/button';
import ButtonsGroup from '@/components/ui/buttons-group';
import { Quality } from '@/data/parsers/yts/models';
import { useM3UUrl } from '@/hooks/useM3UStreamUrl';
import { useStreamUrl } from '@/hooks/useStreamUrl';
import { cn, detectSafari, getMagnetHash } from '@/lib/utils';

import { providers } from '../../../../constants';
import { useCastMagnet, usePrefix } from '../../../../hooks/useMagnetHosts';

import showPlayerModal from './components/Player';
import useFiles from './useFiles';
import useMagnet from './useMagnet';

interface Props {
  torrent: Torrent;
  backdrop: string;
  title: string;
  provider: string;
  onPlay: (options: Promise<{ sources: Sources; magnet: string }>) => void;
  playerEntryId: string;
}

const Actions: FC<Props> = ({ torrent, backdrop, title, provider, playerEntryId, onPlay }) => {
  const prefix = usePrefix();
  const cast = useCastMagnet();
  const streamUrl = useStreamUrl();
  const M3UUrl = useM3UUrl();

  const { isIOS, isSafari } = detectSafari();
  const isHEVC = torrent.codec?.includes('265') || torrent.codec?.toLowerCase().includes('hevc');

  const supportedForStream = useMemo(() => {
    if (provider === providers.yts.key) {
      return (
        [Quality.The1080P, Quality.The720P].includes(torrent.quality as Quality) &&
        (isHEVC ? !isIOS && !isSafari : true)
      );
    }

    const isMP4 = torrent.container?.includes('mp4');

    return isMP4 && (isHEVC ? !isIOS && !isSafari : true);
  }, [isIOS, isSafari, isHEVC, torrent, provider]);

  const fetchMagnet = useMagnet(torrent);

  const magnet = fetchMagnet.data || torrent.magnet;

  const fetchSources = useFiles({ magnet });

  const hash = getMagnetHash(magnet);

  const supportedForCast = prefix && !prefix.includes('{host}');

  const handleM3ULink = () => {
    const link = window.open(
      `${M3UUrl}${encodeURIComponent(`${streamUrl}/stream?m3u&link=${encodeURIComponent(magnet)}`)}`,
      '_blank'
    );
    setTimeout(() => link?.close(), 1000);
  };

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
            onClick={() => {
              showPlayerModal({ backdrop, title, hash, playerEntryId });
              onPlay(fetchSources.mutateAsync().then((sources) => ({ sources, magnet })));
            }}
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
            href={`${streamUrl}/stream?m3u&link=${encodeURIComponent(magnet)}`}
          />
          <ListVideo size={20} />
        </Button>
        <Button className='relative grow-0 px-3' variant='outline' title='Download magnet'>
          <a className='absolute left-0 top-0 size-full' target='_blank' rel='noopener noreferrer' href={magnet} />
          <Magnet size={20} />
        </Button>
        {M3UUrl ? (
          <Button className='relative grow-0 px-3' variant='outline' title='Play m3u playlist' onClick={handleM3ULink}>
            <Cast size={20} />
          </Button>
        ) : (
          supportedForCast && (
            <Button className='grow-0 px-3' variant='outline' onClick={() => cast(magnet)}>
              <Cast size={20} />
            </Button>
          )
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
