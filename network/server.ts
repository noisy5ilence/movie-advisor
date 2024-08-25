class Server {
  get<T>(url: string, {params}: { params?: Record<string, unknown> } = {}): Promise<T> {
    const base = 'https://api.themoviedb.org/3';

    const serializedParams = Object.entries(params || {}).reduce((params, [key, value]) => {
      if (!['', undefined, null].includes(value as string)) {
        params.set(key, value as string);
      }
      return params;
    }, new URLSearchParams());

    return fetch(`${base}${url}?${serializedParams}`, {
      cache: 'force-cache',
      headers: {
        Authorization: `Bearer ${process.env.MOVIE_DB_TOKEN}`,
      }
    }).then(response => response.json());
  }
}

export const server = new Server();

export default server;
