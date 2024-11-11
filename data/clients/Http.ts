import { isServer } from '@tanstack/react-query';

import { SITE_URL } from '@/env';

type Search = Record<string, string | number | boolean | null | undefined>;

class Http {
  constructor(
    private base: string,
    private authorization?: string
  ) {}

  private async request<T, B = unknown>({
    method,
    url,
    base = this.base,
    search,
    body,
    preventCache = true
  }: {
    method: 'GET' | 'POST';
    url: string;
    base?: string;
    search?: Search;
    body?: B;
    preventCache?: boolean;
  }): Promise<T> {
    const searchParams = new URLSearchParams(
      Object.entries(search ?? {}).reduce((params, [key, value]) => {
        if (value != null && value !== '') {
          params.set(key, String(value));
        }
        return params;
      }, new URLSearchParams())
    );

    if (preventCache) {
      searchParams.append('preventCache', '1');
    }

    const searchParamsString = searchParams.toString();

    try {
      const response = await fetch(`${base}${url}${searchParamsString ? `?${searchParamsString}` : ''}`, {
        method,
        headers: {
          Authorization: this.authorization || '',
          'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : undefined,
        next: preventCache ? undefined : { revalidate: 3600 }
      });

      if (!response.ok) {
        return Promise.reject({
          status: response.status,
          statusText: response.statusText
        });
      }

      return response.json();
    } catch (error) {
      return Promise.reject({ message: 'Network or parsing error', error });
    }
  }

  get<T>(
    url: string,
    { params, preventCache }: { params?: Search; preventCache?: boolean } = {},
    base?: string
  ): Promise<T> {
    return this.request<T>({
      url,
      method: 'GET',
      search: params,
      preventCache,
      base
    });
  }

  post<T, B = unknown>(
    url: string,
    { params, preventCache }: { params?: Search; preventCache?: boolean } = {},
    body?: B,
    base?: string
  ): Promise<T> {
    return this.request<T>({
      url,
      method: 'POST',
      search: params,
      body,
      base,
      preventCache
    });
  }
}

export default Http;
