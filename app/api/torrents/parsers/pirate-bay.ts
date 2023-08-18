import axios, { AxiosInstance } from 'axios';
import { parse } from 'node-html-parser';

enum ORDER {
  size = 5,
  seeders = 7
}

export class PirateBay {
  private client: AxiosInstance;

  constructor(private host: string = process.env.PIRATE_BAY_HOST || 'https://thepiratebay10.org') {
    this.host = host;
    this.client = axios.create({
      baseURL: this.host
    });
  }

  async search({
    query,
    page = 1,
    category = 200,
    order = ORDER.size
  }: {
    query: string;
    page?: number;
    category?: number;
    order?: ORDER;
  }) {
    return this.client.post(`/search/${query}/${page}/${order}/${category}`, null).then(({ data }) => {
      const html = parse(data);
      const table = html?.getElementById('searchResult');

      const titles = table?.querySelectorAll('.detLink').map((link) => link.innerText);
      const seeders = table
        ?.querySelectorAll('td[align="right"]')
        .filter((_, index) => index % 2 === 0)
        .map((cell) => cell.innerText);
      const sizes = table?.querySelectorAll('.detDesc').reduce((sizes, description) => {
        const list = description.innerText?.split(', ');
        if (list.length === 1) return sizes;
        const [, size] = list;
        sizes.push(size.replace('&nbsp;', ' ').replace('Size ', ''));
        return sizes;
      }, [] as string[]);
      const magnets = table?.querySelectorAll('a[href^="magnet:"]').map((link) => link.getAttribute('href'));

      return titles.map((title, index) => {
        return {
          title,
          id: title,
          size: sizes[index],
          seeders: parseInt(seeders[index]),
          magnet: magnets[index]
        };
      });
    });
  }
}

const parser = new PirateBay();

export default parser;
