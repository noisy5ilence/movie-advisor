// Next.js ISR/fetch cache stored in a single SQLite file with a size cap.
//
// The default file-system cache writes one file per page/fetch and never evicts
// anything, which grew to millions of files (~80 GB in 5 days) and needed a
// CPU-heavy cleanup. Here every entry is a row, and once the total size passes
// the cap the least recently used rows are deleted, so no cleanup job is needed.
//
// The database lives inside the container, so a redeploy starts with an empty
// cache. That is intentional: cached pages reference the JS chunks of the build
// that rendered them and must not outlive it.
const fs = require('fs');
const path = require('path');
const v8 = require('v8');

const DB_PATH = process.env.NEXT_CACHE_DB || path.join(process.cwd(), '.next', 'cache-db', 'isr.db');
const MAX_BYTES = Number(process.env.NEXT_CACHE_MAX_MB || 5120) * 1024 * 1024;
// Evict down to 90% of the cap, so we don't evict again on every write near the limit.
const EVICT_TO_BYTES = Math.floor(MAX_BYTES * 0.9);
const EVICT_BATCH = 500;
// Same limit Next's default cache applies to fetch responses.
const MAX_FETCH_BYTES = 2 * 1024 * 1024;
// Refresh last_access at most once per interval, to avoid a write on every read.
const TOUCH_INTERVAL_MS = 10 * 60 * 1000;

// Next creates a handler instance per request, so the connection is per process.
let db = null;
let stmts = null;
let unavailable = false;
let totalBytes = 0;

function open() {
  if (db || unavailable) return db;
  try {
    const { DatabaseSync } = require('node:sqlite');
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    db = new DatabaseSync(DB_PATH);
    db.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA synchronous = NORMAL;
      PRAGMA busy_timeout = 5000;
      CREATE TABLE IF NOT EXISTS entries (
        key TEXT PRIMARY KEY,
        value BLOB NOT NULL,
        size INTEGER NOT NULL,
        tags TEXT NOT NULL,
        last_modified INTEGER NOT NULL,
        last_access INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS entries_last_access ON entries (last_access);
      CREATE TABLE IF NOT EXISTS revalidated_tags (
        tag TEXT PRIMARY KEY,
        revalidated_at INTEGER NOT NULL
      );
    `);
    stmts = {
      get: db.prepare('SELECT value, tags, last_modified, last_access FROM entries WHERE key = ?'),
      size: db.prepare('SELECT size FROM entries WHERE key = ?'),
      upsert: db.prepare(`
        INSERT INTO entries (key, value, size, tags, last_modified, last_access) VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT (key) DO UPDATE SET value = excluded.value, size = excluded.size, tags = excluded.tags,
          last_modified = excluded.last_modified, last_access = excluded.last_access
      `),
      remove: db.prepare('DELETE FROM entries WHERE key = ? RETURNING size'),
      touch: db.prepare('UPDATE entries SET last_access = ? WHERE key = ?'),
      total: db.prepare('SELECT COALESCE(SUM(size), 0) AS total FROM entries'),
      oldest: db.prepare('SELECT key, size FROM entries ORDER BY last_access LIMIT ?'),
      revalidate: db.prepare(`
        INSERT INTO revalidated_tags (tag, revalidated_at) VALUES (?, ?)
        ON CONFLICT (tag) DO UPDATE SET revalidated_at = excluded.revalidated_at
      `)
    };
    totalBytes = stmts.total.get().total;
  } catch (err) {
    unavailable = true;
    db = null;
    console.error('[cache-handler] SQLite unavailable, caching disabled:', err);
  }
  return db;
}

function entryTags(data, ctx) {
  if (data.kind === 'FETCH') return ctx.tags || data.tags || [];
  const header = data.headers && data.headers['x-next-cache-tags'];
  return typeof header === 'string' ? header.split(',') : [];
}

function isRevalidatedSince(tags, since) {
  const placeholders = tags.map(() => '?').join(',');
  const row = db
    .prepare(`SELECT MAX(revalidated_at) AS at FROM revalidated_tags WHERE tag IN (${placeholders})`)
    .get(...tags);
  return row.at !== null && row.at >= since;
}

function evict() {
  // Build workers can share the file, so resync the total before evicting.
  totalBytes = stmts.total.get().total;
  while (totalBytes > EVICT_TO_BYTES) {
    const oldest = stmts.oldest.all(EVICT_BATCH);
    if (!oldest.length) break;
    db.exec('BEGIN');
    try {
      for (const row of oldest) {
        if (totalBytes <= EVICT_TO_BYTES) break;
        stmts.remove.get(row.key);
        totalBytes -= row.size;
      }
      db.exec('COMMIT');
    } catch (err) {
      db.exec('ROLLBACK');
      throw err;
    }
  }
}

module.exports = class CacheHandler {
  async get(key, ctx = {}) {
    if (!open()) return null;
    try {
      const row = stmts.get.get(key);
      if (!row) return null;
      const tags = [...JSON.parse(row.tags), ...(ctx.tags || []), ...(ctx.softTags || [])];
      if (tags.length && isRevalidatedSince(tags, row.last_modified)) return null;
      const now = Date.now();
      if (now - row.last_access > TOUCH_INTERVAL_MS) stmts.touch.run(now, key);
      return { lastModified: row.last_modified, value: v8.deserialize(row.value) };
    } catch (err) {
      console.error('[cache-handler] get failed:', key, err);
      return null;
    }
  }

  async set(key, data, ctx = {}) {
    if (!open()) return;
    try {
      if (!data) {
        const removed = stmts.remove.get(key);
        if (removed) totalBytes -= removed.size;
        return;
      }
      const value = v8.serialize(data);
      if (data.kind === 'FETCH' && value.length > MAX_FETCH_BYTES) return;
      const previous = stmts.size.get(key);
      const now = Date.now();
      stmts.upsert.run(key, value, value.length, JSON.stringify(entryTags(data, ctx)), now, now);
      totalBytes += value.length - (previous ? previous.size : 0);
      if (totalBytes > MAX_BYTES) evict();
    } catch (err) {
      console.error('[cache-handler] set failed:', key, err);
    }
  }

  async revalidateTag(tags) {
    if (!open()) return;
    try {
      const now = Date.now();
      for (const tag of typeof tags === 'string' ? [tags] : tags) stmts.revalidate.run(tag, now);
    } catch (err) {
      console.error('[cache-handler] revalidateTag failed:', tags, err);
    }
  }

  resetRequestCache() {}
};
