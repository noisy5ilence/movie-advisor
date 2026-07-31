import { useQuery } from '@tanstack/react-query';

import { useStreamUrl } from '@/hooks/useStreamUrl';

interface Props {
  magnet: string;
}

const NATIVE_EXT = /\.(mp4|m4v|mov)$/i;
const HLS_EXT = /\.(mkv|webm|avi|ts|m2ts)$/i;

export const useFiles = ({ magnet }: Props) => {
  const base = useStreamUrl();
  const link = encodeURIComponent(magnet);
  const streamUrl = `${base}/stream?link=${link}`;

  const { data } = useQuery<Sources>({
    queryKey: ['sources', magnet],
    queryFn: () =>
      fetch(`${streamUrl}&stat`)
        .then((response) => {
          if (!response.ok) return Promise.reject('Download Failed: unable to retrieve the video');

          return response.json();
        })
        .then(({ file_stats: stats, hash }: Stream) => {
          const sources = stats.reduce<Sources>(
            (sources, file) => {
              const name = file.path;

              if (NATIVE_EXT.test(name)) {
                sources.playlist.push({ src: `${streamUrl}&index=${file.id}&play`, name, type: 'video/mp4' });
              } else if (HLS_EXT.test(name)) {
                sources.playlist.push({
                  src: `${base}/gst/${hash}/master.m3u8?index=${file.id}`,
                  name,
                  type: 'application/x-mpegurl'
                });
              }

              if (name.endsWith('.srt')) {
                sources.subtitles.push({ src: `${streamUrl}&index=${file.id}&play`, name, type: 'srt' });
              }

              return sources;
            },
            { subtitles: [], playlist: [] }
          );

          if (!sources.playlist.length)
            return Promise.reject('This torrent doesn’t contain any compatible video files');

          return sources;
        })
  });

  return data;
};
