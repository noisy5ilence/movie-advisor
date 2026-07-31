import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

export interface GstAudioTrack {
  index: number;
  label: string;
}

interface ProbeTrack {
  Index: number;
  Type: string;
  Language?: string;
  Title?: string;
  Channels?: number;
}

const GST_RE = /^(.*)\/gst\/([0-9a-fA-F]+)\/master\.m3u8\?index=(\d+)/;

const label = ({ Language, Title, Channels }: ProbeTrack) =>
  [Language?.toUpperCase(), Title, Channels ? `${Channels}ch` : ''].filter(Boolean).join(' · ') || 'Audio';

export const useGstAudio = (src?: string) => {
  const match = src?.match(GST_RE);
  const [base, hash, index] = match ? [match[1], match[2], match[3]] : [];

  const [audio, setAudio] = useState(0);

  useEffect(() => {
    setAudio(0);
  }, [hash, index]);

  const { data: tracks = [] } = useQuery<GstAudioTrack[]>({
    enabled: Boolean(hash && index),
    queryKey: ['gst-audio', hash, index],
    queryFn: () =>
      fetch(`${base}/gst/${hash}/probe?index=${index}`)
        .then((response) => response.json())
        .then((data: { Tracks?: ProbeTrack[] }) =>
          (data.Tracks ?? [])
            .filter((track) => track.Type === 'audio')
            .map((track) => ({ index: track.Index, label: label(track) }))
        )
  });

  const resolvedSrc = match ? `${src}&audio=${audio}` : src;

  return { tracks, audio, setAudio, resolvedSrc };
};
