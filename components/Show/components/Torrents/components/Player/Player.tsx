'use client';

import { FC, useEffect, useRef } from 'react';
import { InstanceProps } from 'react-modal-promise';
import video from 'video.js';
import WebTorrent from 'webtorrent/dist/webtorrent.min.js';

import { Modal } from '@/components/ui/dialog';

import 'video.js/dist/video-js.css';

interface Props extends InstanceProps<void> {
  magnet: string;
}

const Player: FC<Props> = ({ onResolve, magnet }) => {
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let skip = false;
    const client = new WebTorrent();

    navigator.serviceWorker.register('./sw.min.js', { scope: './' }).then((registration) => {
      const worker = registration.active || registration.waiting || registration.installing;

      const createServer = (worker: ServiceWorker | null) => {
        if (worker?.state !== 'activated' || skip) return false;

        client.createServer({ controller: registration });

        console.log(client);
      };

      if (!createServer(worker)) {
        worker?.addEventListener('statechange', ({ target }) => createServer(target as ServiceWorker));
      }
    });

    return () => {
      skip = true;
      client.removeAllListeners();
      client.destroy();
      navigator.serviceWorker.getRegistration('./sw.min.js').then((registration) => registration?.unregister());
    };
  }, []);

  return (
    <Modal className='block p-0 max-w-[930px] border-none bg-black' style={{ aspectRatio: '16/9' }} onClose={onResolve}>
      <div ref={videoRef} className='w-full h-full' />
    </Modal>
  );
};

export default Player;
