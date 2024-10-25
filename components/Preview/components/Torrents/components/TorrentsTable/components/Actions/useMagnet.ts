import { useMutation } from '@tanstack/react-query';

import { fetchTLKMagnet } from '@/api';

const useMagnet = () => {
  return useMutation({ mutationFn: fetchTLKMagnet });
};

export default useMagnet;
