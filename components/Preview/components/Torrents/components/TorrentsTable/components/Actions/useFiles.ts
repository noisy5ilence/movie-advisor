import { useMutation } from '@tanstack/react-query';

import { useStreamUrl } from '@/hooks/useStreamUrl';

interface Props {
  magnet: string;
}

const useFiles = ({ magnet }: Props) => {
  const streamUrl = `${useStreamUrl()}/stream?link=${encodeURIComponent(magnet)}`;

  return useMutation<Sources>({
    mutationFn: () =>
      fetch(`${streamUrl}&stat`)
        .then((response) => {
          if (!response.ok) return Promise.reject('Download Failed: unable to retrieve the video');

          return response.json();
        })
        .then(({ file_stats: stats }: Stream) => {
          const sources = stats.reduce<Sources>(
            (sources, file) => {
              const src = `${streamUrl}&index=${file.id}&play`;
              const name = file.path;

              if (file.path.endsWith('.mp4')) {
                sources.playlist.push({ src, name, type: 'video/mp4' });
              }

              if (file.path.endsWith('.srt')) {
                sources.subtitles.push({ src, name, type: 'srt' });
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
};

export default useFiles;
