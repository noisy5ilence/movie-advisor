import { FC, useMemo, useState } from 'react';
import { Cast, Download, ListVideo, Loader, Magnet, Play, TrafficCone } from 'lucide-react';

import { providers } from '@/components/Preview/components/Torrents/constants';
import { useCastMagnet, usePrefix } from '@/components/Preview/components/Torrents/hooks/useMagnetHosts';
import { Button } from '@/components/ui/button';
import ButtonsGroup from '@/components/ui/buttons-group';
import { Quality } from '@/data/parsers/yts/models';
import { useM3UUrl } from '@/hooks/useM3UStreamUrl';
import { useStreamUrl } from '@/hooks/useStreamUrl';
import { cn, detectSafari, getMagnetHash, isStandaloneApp } from '@/lib/utils';

import showPlayerModal from './components/Player';
import useMagnet from './useMagnet';

interface Props {
  show: Show & Partial<Details>;
  torrent: Torrent;
  title: string;
  provider: string;
}

const Actions: FC<Props> = ({ torrent, title, provider, show }) => {
  const prefix = usePrefix();
  const cast = useCastMagnet();
  const streamUrl = useStreamUrl();
  const M3UUrl = useM3UUrl();
  const [isStreamPending, setIsStreamPending] = useState(false);

  const isStandalone = isStandaloneApp();

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

  const hash = getMagnetHash(magnet);

  const supportedForCast = prefix && !prefix.includes('{host}');

  const handleM3ULink = () => {
    setIsStreamPending(true);

    const params = new URLSearchParams({
      m3u: `${streamUrl}/stream?m3u&link=${magnet}`,
      poster: show.poster['2x'],
      backdrop: show.backdrop,
      type: show.type,
      name: show.title,
      imdb_id: show.imdb_id ?? '',
      year: new Date(show.release).getFullYear().toString(),
      runtime: show.runtime?.toString() ?? ''
    });

    if (isSafari) {
      return fetch(`${M3UUrl}?${params}`, {
        method: 'GET',
        keepalive: true,
        mode: 'no-cors'
      })
        .catch(() => {})
        .finally(() => setIsStreamPending(false));
    }

    const resolver = new Image();

    resolver.src = `${M3UUrl}?${params}`;
    resolver.onerror = resolver.onload = () => setIsStreamPending(false);
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
              showPlayerModal({ backdrop: show.backdrop, title, hash, magnet });
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
          <Button
            className='relative h-[32px] w-[45px] grow-0 px-3'
            variant='outline'
            title='Play m3u playlist'
            onClick={handleM3ULink}
            disabled={isStreamPending}
          >
            {isStreamPending ? (
              <div className='animate-spin'>
                <Loader size={18} />
              </div>
            ) : (
              <Cast size={20} />
            )}
          </Button>
        ) : (
          supportedForCast && (
            <Button className='grow-0 px-3' variant='outline' onClick={() => cast(magnet)}>
              <Cast size={20} />
            </Button>
          )
        )}
        {isStandalone && (
          <Button className='relative grow-0 px-3' variant='outline' title='Play in VLC' asChild>
            <a
              className='absolute left-0 top-0 size-full'
              rel='noopener noreferrer'
              href={`vlc://${streamUrl}/stream?m3u&link=${encodeURIComponent(magnet)}`}
            />
            <TrafficCone size={19} />
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
