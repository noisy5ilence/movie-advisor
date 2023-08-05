import axios, { AxiosResponse } from 'axios';

const client = axios.create({
  baseURL: `${process.env.NODE_ENV === 'development' ? 'http://' : 'https://'}${
    process.env.NEXT_PUBLIC_VERCEL_URL
  }/api`,
  withCredentials: true
});

const handleResponse = (response: AxiosResponse): AxiosResponse['data'] => response.data;

client.interceptors.response.use(handleResponse);

client.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') return config;

  const { cookies } = await import('next/headers');

  config.headers.set('Cookie', cookies().toString());

  return config;
});

export default client;
