import { useQuery } from '@tanstack/react-query';

import { torrentFiles } from '@/api';

interface Props {
  magnet: string;
  onSuccess: (files: Source[]) => void;
}

const useFiles = ({ magnet, onSuccess }: Props) =>
  useQuery({
    queryKey: [magnet],
    queryFn: () =>
      torrentFiles(magnet).then((files) => {
        onSuccess(files);
        return files;
      })
  });

export default useFiles;
