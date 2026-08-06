import { Redis } from '@upstash/redis';

import { UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL } from '@/env';

const redis =
  UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN
    ? new Redis({ url: UPSTASH_REDIS_REST_URL, token: UPSTASH_REDIS_REST_TOKEN })
    : null;

export default redis;
