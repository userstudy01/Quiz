/**
 * Two-layer read cache for GET responses.
 *
 * Why this exists: the API is hosted on a free instance that sleeps after a
 * period without traffic, and waking it takes far longer than a visitor will
 * wait. Two problems follow, and this file handles both:
 *
 *   memory   the same project list was refetched on every route change, so
 *            moving between pages paid the network cost again each time
 *   storage  a visitor who has seen the site before should not stare at an
 *            error page while the server wakes up
 *
 * The rule this keeps: cached values are *previous real responses from this
 * API*, never invented content. A stale copy is only ever served when the
 * network attempt failed, and the caller is told the data is stale so the UI
 * can say so.
 */

const STORE_KEY = 'portfolio:cache:v1';
const FRESH_MS = 60_000; // in-memory hit is reused without a refetch
const STALE_MS = 24 * 60 * 60 * 1000; // persisted copy is offered as a fallback

const memory = new Map();

/* localStorage is optional: private browsing, full quota and embedded
   webviews can all make it throw. Every access is guarded and failure just
   means the in-memory layer works alone. */
function readStore() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeStore(store) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  } catch {
    /* Over quota or unavailable — the memory layer still works. */
  }
}

/**
 * Params that do not change the response are dropped before keying, so the
 * same list requested from two pages is one cache entry rather than two.
 *
 * `'all'` is the "no filter selected" sentinel the archive controls use and
 * the API ignores it, so `category=all` and no category at all are the same
 * request. No real category is named "all", so nothing collides.
 */
export function cacheKey(url, params) {
  const entries = Object.entries(params || {})
    .filter(
      ([, value]) =>
        value !== undefined && value !== '' && value !== null && value !== 'all' && value !== false
    )
    .sort(([a], [b]) => a.localeCompare(b));
  return entries.length
    ? `${url}?${entries.map(([k, v]) => `${k}=${v}`).join('&')}`
    : url;
}

/** A value written less than FRESH_MS ago, or null. */
export function readFresh(key) {
  const hit = memory.get(key);
  if (hit && Date.now() - hit.at < FRESH_MS) return hit.value;
  return null;
}

/**
 * The newest value for this key regardless of age, used only when a request
 * has already failed. Returns null once the copy is older than STALE_MS.
 */
export function readStale(key) {
  const hit = memory.get(key);
  if (hit) return hit.value;

  const entry = readStore()[key];
  if (entry && Date.now() - entry.at < STALE_MS) {
    memory.set(key, entry);
    return entry.value;
  }
  return null;
}

export function write(key, value) {
  const entry = { at: Date.now(), value };
  memory.set(key, entry);

  // Only list-shaped payloads are worth persisting; a full store rewrite per
  // response would be wasteful, so drop anything already older than STALE_MS
  // while we are here.
  const store = readStore();
  const cutoff = Date.now() - STALE_MS;
  Object.keys(store).forEach((k) => {
    if (!store[k] || store[k].at < cutoff) delete store[k];
  });
  store[key] = entry;
  writeStore(store);
}

/** Clears everything. Exposed for the retry buttons in the error states. */
export function clear() {
  memory.clear();
  writeStore({});
}
