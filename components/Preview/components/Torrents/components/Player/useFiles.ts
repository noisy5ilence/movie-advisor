import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useStreamUrl } from '@/hooks/useStreamUrl';
import { useToast } from '@/hooks/useToast';

export type Source = { name: string; src: string; type: string };
type Sources = { subtitles: Source[]; videos: Source[] };

interface Props {
  magnet: string;
  onResolve: () => void;
}

const useFiles = ({ magnet, onResolve }: Props) => {
  const streamUrl = `${useStreamUrl()}/stream?link=${encodeURIComponent(magnet)}`;
  const query = useQuery<Stream>({
    queryKey: ['files', magnet],
    queryFn: () => fetch(`${streamUrl}&stat&preload`).then((response) => response.json())
  });

  const data = (query.data?.file_stats || []).reduce<Sources>(
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
  );

  const isResolvedRef = useRef(false);

  const { toast } = useToast();

  useEffect(() => {
    const close = () => {
      if (isResolvedRef.current) return;

      isResolvedRef.current = true;
      onResolve();
    };

    if (query.error) {
      toast({ description: 'Download Failed: unable to retrieve the video' });
      close();
    }

    if (query.isFetched && !data.videos.length) {
      toast({ description: 'This torrent doesn’t contain any compatible video files' });
      close();
    }
  }, [query.isFetched, data.videos.length, query.error]);

  return data;
};

export default useFiles;
