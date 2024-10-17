class Http {
  private base = 'https://api.themoviedb.org/3';

  get<T>(
    url: string,
    { params, force }: { params?: Record<string, unknown>; force?: boolean } = {},
    base?: string
  ): Promise<T> {
    const serializedParams = Object.entries(params || {}).reduce((params, [key, value]) => {
      if (!['', undefined, null].includes(value as string)) {
        params.set(key, value as string);
      }

      return params;
    }, new URLSearchParams());

    return fetch(`${base || this.base}${url}?${serializedParams}`, {
      headers: {
        Authorization: `Bearer ${process.env.MOVIE_DB_TOKEN}`
      },
      next: force ? undefined : { revalidate: 3600 }
    }).then((response) => {
      if (!response.ok) return Promise.reject(response);

      return response.json();
    });
  }
}

const http = new Http();

export default http;
