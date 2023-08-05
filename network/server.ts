import axios, { AxiosResponse } from 'axios';

export const server = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Authorization: `Bearer ${process.env.MOVIE_DB_TOKEN}`,
    accept: 'application/json'
  }
});

const handleResponse = (response: AxiosResponse): AxiosResponse['data'] => response.data;

server.interceptors.response.use(handleResponse);

export default server;
