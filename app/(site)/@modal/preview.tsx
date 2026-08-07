'use client';

import { FC } from 'react';
import { useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';

import Preview from '@/components/Preview';
import { previewSeedAtom } from '@/components/Preview/seed';
import { Modal } from '@/components/ui/dialog';

interface Props {
  showId: Show['id'];
  showType: Show['type'];
}

const PreviewModal: FC<Props> = ({ showId, showType }) => {
  const router = useRouter();
  const seed = useAtomValue(previewSeedAtom);

  const show = seed?.id === showId && seed?.type === showType ? seed : undefined;

  return (
    <Modal className='block bg-background p-0 md:bg-black' onClose={() => router.back()}>
      <Preview modal show={show} showId={showId} showType={showType} />
    </Modal>
  );
};

export default PreviewModal;
