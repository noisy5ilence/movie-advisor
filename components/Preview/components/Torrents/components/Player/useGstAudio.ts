import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import useUnplayable from '@/components/Preview/components/Torrents/useUnplayable';

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

  const { markUnplayable } = useUnplayable();

  const [audio, setAudio] = useState(0);

  useEffect(() => {
    setAudio(0);
  }, [hash, index]);

  const { data: tracks = [], error } = useQuery<GstAudioTrack[]>({
    enabled: Boolean(hash && index),
    // a rejected codec/container won't change on retry
    retry: false,
    queryKey: ['gst-audio', hash, index],
    queryFn: async () => {
      const response = await fetch(`${base}/gst/${hash}/probe?index=${index}`);

      // the transcoder answers 5xx with a plain-text reason, e.g. "unsupported video codec"
      if (!response.ok) throw new Error((await response.text()).trim() || `stream error ${response.status}`);

      const data: { Tracks?: ProbeTrack[] } = await response.json();

      return (data.Tracks ?? [])
        .filter((track) => track.Type === 'audio')
        .map((track) => ({ index: track.Index, label: label(track) }));
    }
  });

  const reason = error instanceof Error ? error.message : undefined;

  // codec/container rejections are permanent for this backend — remember them to grey out Play
  useEffect(() => {
    if (reason && /unsupported (video codec|container)/i.test(reason)) markUnplayable(hash, reason);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reason, hash]);

  const resolvedSrc = match ? `${src}&audio=${audio}` : src;

  return { tracks, audio, setAudio, resolvedSrc, error: reason };
};
