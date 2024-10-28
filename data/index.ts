'use server';

import { cookies } from 'next/headers';

import movieDB from './clients/movieDB';

export const session = async () => cookies().get('session')?.value;

export const createRequestToken = async () => {
  return movieDB.get<RequestToken>('/authentication/token/new', { preventCache: true }).then(({ request_token }) => ({
    redirectUrl: `https://www.themoviedb.org/authenticate/${request_token}`,
    requestToken: request_token
  }));
};

export const createSession = async ({ requestToken }: { requestToken: string }) => {
  return movieDB.post<Session>('/authentication/session/new', {
    params: { request_token: requestToken },
    preventCache: true
  });
};
