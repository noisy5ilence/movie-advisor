import { NextResponse } from 'next/server';
import Tracker from 'rutracker-api-with-proxy';

export async function GET(request: Request) {
  const params = Object.fromEntries(new URL(request.url).searchParams.entries());

  try {
    const tracker = new Tracker();
    await tracker.login({ username: process.env.TRACKER_LOGIN, password: process.env.TRACKER_PASSWORD });

    const results: TrackerTorrent[] = await tracker.search({ query: params.query });

    const movies = results.filter((torrent) => torrent.category.includes('кино'));

    const links = ((await Promise.all(movies?.map(({ id }) => tracker.getMagnetLink(id)))) || []) as string[];

    const torrents =
      movies?.map(
        ({ seeds, title, id, size }, index) =>
          ({
            seeders: seeds,
            title,
            id,
            magnetLink: links[index],
            size: `${(size / (1024 * 1024 * 1024)).toFixed(2)} GiB`
          }) as Torrent
      ) || [];

    return NextResponse.json(torrents);
  } catch (error) {
    return NextResponse.json([
      { title: `${JSON.stringify(error)}, ${process.env.TRACKER_LOGIN}, ${process.env.TRACKER_PASSWORD}` }
    ]);
  }
}

export const revalidate = 0;
