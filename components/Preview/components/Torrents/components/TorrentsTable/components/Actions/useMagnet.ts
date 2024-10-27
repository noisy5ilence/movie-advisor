import { useMutation } from '@tanstack/react-query';

const useMagnet = (torrent: Torrent) => {
  return useMutation({
    mutationFn: async () =>
      torrent.magnet ? torrent.magnet : fetch(`/api/magnet?url=${torrent.download}`).then((response) => response.json())
  });
};

export default useMagnet;
