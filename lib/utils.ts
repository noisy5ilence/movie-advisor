import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

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
