import { useQuery } from '@tanstack/react-query';

interface Props {
  magnet: string;
}

const useSubtitles = ({ magnet }: Props) =>
  useQuery<Subtitles[]>({
    queryKey: [magnet],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_TRACKER_PROXY_BASE}/subtitles?magnet=${encodeURIComponent(magnet)}`).then(
        (response) => response.json()
      )
  });

export default useSubtitles;
