import { create } from 'react-modal-promise';
import dynamic from 'next/dynamic';

const Player = dynamic(() => import('./Player'), { ssr: false });

const showPlayer = create(Player);

export default showPlayer;
