import { FC } from 'react';

import PreviewModal from '../../preview';

interface Props {
  params: { id: string };
}

const SeriesModal: FC<Props> = ({ params: { id } }) => <PreviewModal showId={Number(id)} showType='tv' />;

export default SeriesModal;
