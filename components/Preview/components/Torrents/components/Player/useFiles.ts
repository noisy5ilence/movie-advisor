import { useQuery } from '@tanstack/react-query';

import { STREAM_URL } from '@/env';

export type Source = { name: string; src: string; type: string };
type Sources = { subtitles: Source[]; videos: Source[] };

const useFiles = (magnet: string) => {
  const streamUrl = `${STREAM_URL}?link=${encodeURIComponent(magnet)}`;
  const query = useQuery<Stream>({
    queryKey: ['files', magnet],
    queryFn: () => fetch(`${streamUrl}&stat`).then((response) => response.json())
  });

  return {
    ...query,
    data: (query.data?.file_stats || []).reduce<Sources>(
      (sources, file) => {
        if (file.path.endsWith('.mp4')) {
          sources.videos.push({ src: `${streamUrl}&index=${file.id}&play`, name: file.path, type: 'video/mp4' });
        }

        if (file.path.endsWith('.srt')) {
          sources.subtitles.push({ src: `${streamUrl}&index=${file.id}&play`, name: file.path, type: 'srt' });
        }

        return sources;
      },
      { subtitles: [], videos: [] }
    )
  };
};

export default useFiles;
