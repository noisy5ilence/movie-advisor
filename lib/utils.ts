import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/, '');

// Keyword-carrying show URL (/movie/27205-inception); the slug is optional decoration —
// routing only relies on the leading numeric id.
export const showPath = ({ type, id, title }: Pick<Show, 'type' | 'id' | 'title'>) => {
  const slug = slugify(title || '');

  return `/${type}/${id}${slug ? `-${slug}` : ''}`;
};

export const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(date))
    .replace(/\//g, '.');

export const createUniqueRandomGenerator = (max: number) => {
  const numbers = Array.from({ length: max }, (_, i) => i + 1);

  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

  let index = 0;

  return () => {
    if (index >= numbers.length) {
      index = 0;
    }

    return numbers[index++];
  };
};

export const getMagnetHash = (link: string) => {
  const [, hash] = link.match(/btih:([A-Fa-f0-9]{40}|[A-Za-z0-9]{32})/) || [];
  return hash?.toUpperCase();
};

// Stable identity for a torrent that survives the lazy empty -> fetched magnet transition:
// Toloka has a permanent download URL, the rest always carry a magnet infohash.
export const torrentKey = (torrent: Torrent) =>
  torrent.download || getMagnetHash(torrent.magnet) || torrent.hash || torrent.id;

export const formatBytes = (bytes?: number) => {
  if (bytes == null || !isFinite(bytes)) return '';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'] as const;

  let i = 0;
  let v = bytes;

  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }

  return `${v.toFixed(v < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
};

export const detectSafari = () => {
  const ua = navigator.userAgent;
  const isSafari = ua.includes('Safari') && !ua.includes('Chrome') && !ua.includes('CriOS') && !ua.includes('FxiOS');

  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  return { isSafari, isIOS };
};

export const isStandaloneApp = () => window.matchMedia('screen and (display-mode: standalone)').matches;
