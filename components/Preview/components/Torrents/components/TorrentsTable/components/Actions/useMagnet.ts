import { useMutation } from '@tanstack/react-query';

const useMagnet = (torrent: Torrent) => {
  return useMutation({
    retry: 4,
    mutationFn: async () => {
      try {
        const response = await fetch(`/api/magnet?url=${torrent.download}`);

        if (!response.ok) return Promise.reject();

        return response.json();
      } catch (error) {
        return Promise.reject(error);
      }
    }
  });
};

export default useMagnet;
