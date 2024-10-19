import { useQuery } from '@tanstack/react-query';

export type Source = { name: string; src: string; type: string };
type Sources = { subtitles: Source[]; videos: Source[] };

const useFiles = (magnet: string) => {
  const STREAM_URL = `${process.env.NEXT_PUBLIC_TORRENT_PROXY}/stream?link=${encodeURIComponent(magnet)}`;

  const query = useQuery<Stream>({
    queryKey: ['files', magnet],
    queryFn: () => fetch(`${STREAM_URL}&stat`).then((response) => response.json())
  });

  return {
    ...query,
    data: (query.data?.file_stats || []).reduce<Sources>(
      (sources, file) => {
        if (file.path.endsWith('.mp4')) {
          sources.videos.push({ src: `${STREAM_URL}&index=${file.id}&play`, name: file.path, type: 'video/mp4' });
        }

        if (file.path.endsWith('.srt')) {
          sources.subtitles.push({ src: `${STREAM_URL}&index=${file.id}&play`, name: file.path, type: 'srt' });
        }

        return sources;
      },
      { subtitles: [], videos: [] }
    )
  };
};

export default useFiles;
