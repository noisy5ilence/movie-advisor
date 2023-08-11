import axios, { Axios, AxiosError, AxiosInstance } from 'axios';
import iconv from 'iconv-lite';
import { parse } from 'node-html-parser';

export class Tracker {
  private client: AxiosInstance;
  // private authorized: Promise<boolean>;

  constructor(
    private credentials: { login: string; password: string },
    private host: string = process.env.TRACKER_HOST || 'https://rutracker.org/forum'
  ) {
    this.host = host;
    this.credentials = credentials;
    this.client = axios.create({
      baseURL: this.host,
      responseType: 'arraybuffer',
      headers: {
        Cookie:
          'bb_guid=VRSW4TnBYXKS;bb_ssl=1;opt_js={%22only_new%22:0%2C%22h_flag%22:0%2C%22h_av%22:0%2C%22h_rnk_i%22:0%2C%22h_post_i%22:0%2C%22h_smile%22:0%2C%22h_sig%22:0%2C%22sp_op%22:0%2C%22tr_tm%22:0%2C%22h_cat%22:%22%22%2C%22h_tsp%22:0%2C%22h_ta%22:76};bb_t=a%3A5%3A%7Bi%3A6370796%3Bi%3A1685706087%3Bi%3A6358638%3Bi%3A1683106302%3Bi%3A6123599%3Bi%3A1664644059%3Bi%3A6169892%3Bi%3A1643607794%3Bi%3A6169913%3Bi%3A1643503061%3B%7D;bb_session=0-17771272-7EtecN88pRZEt82Uf9z7;cf_clearance=sR1CBz2JU3HK8IH8USbPQg681FvxoKMEDFcp.bOCiMw-1691858160-0-1-9ac26b22.c8ca8b5e.cdc334c2-0.2.1691858160'
      }
    });
    this.client.interceptors.response.use((response) => ({
      ...response,
      data: iconv.decode(response.data, 'win1251')
    }));
    // this.authorized = this.login();
  }

  async login() {
    const body = new URLSearchParams();

    body.append('redirect', 'index.php');
    body.append('login_username', this.credentials.login);
    body.append('login_password', this.credentials.password);
    body.append('login', 'Вход');

    return this.client
      .post('/login.php', body.toString(), {
        maxRedirects: 0,
        validateStatus(status) {
          return status === 302;
        }
      })
      .then(({ headers }) => {
        const [_, session] = headers['set-cookie'] || [];
        const [Cookie] = (session || '').split(';');

        this.client.defaults.headers.common = {
          Cookie: `bb_ssl=1; ${Cookie}`
        };

        return true;
      });
  }

  async search({ query, page = 0, searchId }: { query: string; page?: number; searchId?: string }) {
    // try {
    //   await this.authorized.catch((error) => {
    //     return Promise.reject(iconv.decode(error.response?.data, 'win1251'));
    //   });
    // } catch (error) {
    //   return Promise.resolve(error);
    // }

    return this.client
      .post('/tracker.php', null, {
        params: {
          nm: query,
          search_id: searchId,
          start: page * 50
        }
      })
      .then(({ data }) => {
        const html = parse(data);

        const topics = html.querySelectorAll('tr[data-topic_id]').map((row) => {
          return {
            id: row.getAttribute('data-topic_id'),
            category: row.querySelector('.f-name .ts-text')?.text,
            size: row.querySelector('.tor-size .tr-dl')?.text?.replace(' ↓', ''),
            title: row.querySelector('.t-title .ts-text')?.text,
            seeders: parseInt(row.querySelector('.seedmed')?.text || '0'),
            searchId: new URLSearchParams(html.querySelector('.pg')?.getAttribute('href')?.split('?')?.[1]).get(
              'search_id'
            )
          };
        });

        return topics;
      });
  }

  fetchMagnet(torrentId: string) {}
}

const tracker = new Tracker({ login: process.env.TRACKER_LOGIN!, password: process.env.TRACKER_PASSWORD! });

export default tracker;
