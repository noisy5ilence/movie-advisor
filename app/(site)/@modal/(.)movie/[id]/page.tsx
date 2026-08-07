import { FC } from 'react';

import PreviewModal from '../../preview';

interface Props {
  params: { id: string };
}

const MovieModal: FC<Props> = ({ params: { id } }) => <PreviewModal showId={Number(id)} showType='movie' />;

export default MovieModal;
