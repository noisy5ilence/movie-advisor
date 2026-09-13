import { FC, useEffect, useMemo, useState } from 'react';
import { Cast, Download, ListVideo, Loader, Magnet, MoreHorizontal, Play, TrafficCone } from 'lucide-react';

import { providers } from '@/components/Preview/components/Torrents/constants';
import { useCastMagnet, usePrefix } from '@/components/Preview/components/Torrents/hooks/useMagnetHosts';
import { Button } from '@/components/ui/button';
import ButtonsGroup from '@/components/ui/buttons-group';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Quality } from '@/data/parsers/yts/models';
import { useM3UUrl } from '@/hooks/useM3UStreamUrl';
import { useStreamUrl } from '@/hooks/useStreamUrl';
import analytics from '@/lib/analytics';
import { cn, detectSafari, getMagnetHash, isStandaloneApp, seasonFromEpisodes, torrentKey } from '@/lib/utils';

import useLaunchedTorrents from '../../../../useLaunchedTorrents';
import usePinnedTorrents from '../../../../usePinnedTorrents';
import useUnplayable from '../../../../useUnplayable';

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

  const { isSafari } = detectSafari();

  const supportedForStream = useMemo(() => {
    if (provider === providers.yts.key) {
      return [Quality.The1080P, Quality.The720P].includes(torrent.quality as Quality);
    }

    const container = torrent.container?.toLowerCase();

    return !container || /mp4|mkv|webm|mov|m4v|avi|ts/.test(container);
  }, [torrent, provider]);

  const fetchMagnet = useMagnet(torrent);

  const { savedMagnet, rememberMagnet } = usePinnedTorrents();
  const { isLaunched, launch } = useLaunchedTorrents();
  const { reasonFor } = useUnplayable();

  const key = torrentKey(torrent);
  const launched = isLaunched(key);

  const magnet = fetchMagnet.data || torrent.magnet || savedMagnet(key) || '';

  const hash = getMagnetHash(magnet);

  const unplayable = reasonFor(hash);

  useEffect(() => {
    if (magnet && !torrent.magnet) rememberMagnet(key, magnet);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [magnet, key, torrent.magnet]);

  const trackLaunch = () => {
    analytics.torrentSelected({
      showId: show.id,
      showType: show.type,
      showTitle: show.title,
      provider,
      torrentTitle: torrent.title,
      seeders: torrent.seeders,
      quality: torrent.quality,
      source: torrent.source,
      codec: torrent.codec
    });

    launch(key);
  };

  const supportedForCast = prefix && !prefix.includes('{host}');
  const showCast = Boolean(M3UUrl || supportedForCast);
  const m3uUrl = `${streamUrl}/stream?m3u&link=${encodeURIComponent(magnet)}`;
  const vlcUrl = `vlc://${m3uUrl}`;

  const launchedCastClass = 'border-blue-600 bg-blue-600 text-white hover:bg-blue-600 hover:text-white';

  const handleM3ULink = () => {
    trackLaunch();
    setIsStreamPending(true);

    const params = new URLSearchParams({
      m3u: `${streamUrl}/stream?m3u&link=${magnet}`,
      poster: show.poster['2x'],
      backdrop: show.backdrop,
      type: show.type,
      name: show.title,
      imdb_id: show.imdb_id ?? '',
      tmdb_id: show.id?.toString() ?? '',
      year: new Date(show.release).getFullYear().toString(),
      runtime: show.runtime?.toString() ?? ''
    });

    // This app's origin — the TV calls back to /api/subtitles (and, for Toloka
    // series, /api/refresh) here. Distinct from the m3u stream host.
    params.set('app', window.location.origin);

    if (show.type === 'tv') {
      const season = seasonFromEpisodes(torrent.episodes) ?? show.airing?.season;
      if (season != null) params.set('season', season.toString());

      // Toloka thread id (download.php?id=<id>): the TV stores it and later asks
      // movie-advisor's /api/refresh to re-pull the thread's current magnet, so
      // a still-airing season picks up new episodes on its own.
      if (provider === providers.tlk.key && torrent.download) {
        const tid = new URLSearchParams(torrent.download.split('?')[1] || '').get('id');
        if (tid) params.set('tlk', tid);
      }
    }

    if (isSafari) {
      const link = window.open(`${M3UUrl}?${params}`, '_blank');
      return setTimeout(() => {
        link?.close();
        setIsStreamPending(false);
      }, 300);
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
            disabled={Boolean(unplayable)}
            className={cn(
              'flex-grow-0 px-3',
              unplayable
                ? 'bg-muted text-muted-foreground hover:bg-muted'
                : 'bg-red-600 hover:shadow-lg hover:shadow-red-600/60 duration-200 transition-all hover:bg-red-600',
              { invisible: !magnet || fetchMagnet.isPending }
            )}
            onClick={() => {
              trackLaunch();
              showPlayerModal({ backdrop: show.backdrop, title, hash, magnet, show, episodes: torrent.episodes });
            }}
            title={unplayable ? `Can’t stream in browser: ${unplayable}` : 'Play'}
          >
            <Play size={15} fill={launched ? 'currentColor' : 'none'} />
          </Button>
        )}
        {showCast &&
          (M3UUrl ? (
            <Button
              className={cn(
                'relative h-[32px] w-[45px] grow-0 px-3',
                supportedForStream && '-ml-px',
                launched && launchedCastClass
              )}
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
            <Button
              className={cn('grow-0 px-3', supportedForStream && '-ml-px', launched && launchedCastClass)}
              variant='outline'
              title='Cast to TV'
              onClick={() => {
                trackLaunch();
                cast(magnet);
              }}
            >
              <Cast size={20} />
            </Button>
          ))}
        {!showCast && (
          <Button variant='outline' className='relative grow-0 px-3' title='Download m3u playlist'>
            <a className='absolute left-0 top-0 size-full' target='_blank' rel='noopener noreferrer' href={m3uUrl} />
            <ListVideo size={20} />
          </Button>
        )}
        {!showCast && (
          <Button className='relative grow-0 px-3' variant='outline' title='Download magnet'>
            <a className='absolute left-0 top-0 size-full' target='_blank' rel='noopener noreferrer' href={magnet} />
            <Magnet size={20} />
          </Button>
        )}
        {!showCast && isStandalone && (
          <Button className='relative grow-0 px-3' variant='outline' title='Play in VLC' asChild>
            <a className='absolute left-0 top-0 size-full' rel='noopener noreferrer' href={vlcUrl} />
            <TrafficCone size={19} />
          </Button>
        )}
        {showCast && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                className='h-8 grow-0 rounded-none rounded-r-md border-l-0 px-3 focus-visible:ring-0 data-[state=open]:bg-accent'
                aria-label='More options'
              >
                <MoreHorizontal size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem asChild>
                <a target='_blank' rel='noopener noreferrer' href={m3uUrl}>
                  <ListVideo />
                  Download m3u playlist
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a target='_blank' rel='noopener noreferrer' href={magnet}>
                  <Magnet />
                  Download magnet
                </a>
              </DropdownMenuItem>
              {isStandalone && (
                <DropdownMenuItem asChild>
                  <a rel='noopener noreferrer' href={vlcUrl}>
                    <TrafficCone />
                    Play in VLC
                  </a>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
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
