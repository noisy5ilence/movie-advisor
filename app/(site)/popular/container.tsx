'use client';

import List from '@/components/List';
import NoResults from '@/components/NoResults';
import { Player } from '@/components/Show/components/Torrents/components/Player';

import usePopular from './usePopular';

const Container = () => {
  const { shows, fetchNextPage, isFetched } = usePopular();

  if (isFetched && !shows.length) return <NoResults />;

  return (
    <>
      <Player
        backdrop='https://image.tmdb.org/t/p/w1280//lgkPzcOSnTvjeMnuFzozRO5HHw1.jpg'
        magnet='magnet:?xt=urn:btih:8844A64033DA9AC2E94CE5F82FA645297B7F09D3&dn=Despicable%20Me%204&tr=udp://open.demonii.com:1337/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://p4p.arenabg.com:1337&tr=udp://tracker.leechers-paradise.org:6969'
      />
      <List shows={shows} fetchNextPage={fetchNextPage} />
    </>
  );
};

export default Container;
