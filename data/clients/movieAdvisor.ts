import { isServer } from '@tanstack/react-query';

import { SITE_URL } from '@/env';

import Http from './Http';

const ROOT = isServer ? `${SITE_URL?.startsWith('http') ? SITE_URL : `https://${SITE_URL}`}` : '';

const movieAdvisor = new Http(`${ROOT}/api/tmdb`);

export default movieAdvisor;
