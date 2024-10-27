'use server';

import { cookies } from 'next/headers';

import mapMoviesSeriesResponseToShows from './dto/Show';
import http from './clients/theMovieDb';

export const session = () => cookies().get('session')?.value;

export const createRequestToken = async () => {
  return http.get<RequestToken>('/authentication/token/new', { preventCache: true }).then(({ request_token }) => ({
    redirectUrl: `https://www.themoviedb.org/authenticate/${request_token}`,
    requestToken: request_token
  }));
};

export const createSession = async ({ requestToken }: { requestToken: string }) => {
  return http.post<Session>('/authentication/session/new', {
    params: { request_token: requestToken },
    preventCache: true
  });
};

export const account = async () => {
  return http.get<Account>('/account/null', {
    params: { session_id: session() },
    preventCache: true
  });
};

export const accountStates = async ({ showId, showType }: { showId: Show['id']; showType: Show['type'] }) => {
  return http.get<ShowState>(`/${showType}/${showId}/account_states`, {
    params: { session_id: session() },
    preventCache: true
  });
};

export const updateAccountStates = async ({
  showId,
  showType,
  list,
  value
}: {
  showId: Show['id'];
  showType: Show['type'];
  list: 'favorite' | 'watchlist';
  value: boolean;
}) => {
  http.post(
    `/account/null/${list}`,
    { params: { session_id: session() }, preventCache: true },
    {
      media_id: showId,
      media_type: showType,
      [list]: value
    }
  );
};

export const usersShows = async ({
  showType,
  list,
  page
}: {
  showType: Show['type'];
  list: 'favorite' | 'watchlist';
  page: string;
}): Promise<Pagination<Show>> => {
  return http
    .get<TMDBPagination<Movie>>(`/account/null/${list}/${showType === 'tv' ? 'tv' : 'movies'}`, {
      params: { page, sort_by: 'created_at.desc', session_id: session() },
      preventCache: true
    })
    .then((response) => mapMoviesSeriesResponseToShows(response, showType));
};
