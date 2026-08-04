import { isServer } from '@tanstack/react-query';

import { SITE_URL } from '@/env';

import Http from './Http';

const PUBLIC_ORIGIN = `${SITE_URL?.startsWith('http') ? SITE_URL : `https://${SITE_URL}`}`;

const ROOT = process.env.NODE_ENV === 'development' ? `http://127.0.0.1:${process.env.PORT || 3000}` : PUBLIC_ORIGIN;

const movieAdvisor = new Http(`${isServer ? ROOT : ''}/api/tmdb`);

export default movieAdvisor;
