import axios from 'axios';
import { cacheKey, readFresh, readStale, write, clear } from './cache';

/* ==========================================================================
   API client.

   The endpoints and payload shapes are unchanged — this file only adds the
   handling a free-tier host needs:

     retry     a sleeping instance refuses or times out the first request, so
               idempotent GETs are retried with a backoff before giving up
     cache     a successful GET is remembered, so route changes are instant
               and a later failure can still show the last real response

   Only GET is cached and retried. The contact POST is sent exactly once, so a
   slow network can never turn into two messages in the inbox.
   ========================================================================== */

const baseURL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

/* Long enough to cover a cold start on a sleeping instance, short enough that
   a genuinely dead host still fails while the visitor is watching. */
const REQUEST_TIMEOUT = 30_000;
const RETRY_DELAYS = [1200, 3000];

const api = axios.create({ baseURL, timeout: REQUEST_TIMEOUT });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* Worth retrying: the request never produced an answer (timeout, DNS, refused
   connection) or the server failed in a way that is plausibly transient. A 404
   or a validation error is an answer, and repeating it would only stall the
   page. */
const isRetryable = (error) => {
  if (error?.code === 'ECONNABORTED' || error?.code === 'ERR_NETWORK') return true;
  const status = error?.response?.status;
  return status === 429 || status === 502 || status === 503 || status === 504;
};

async function get(url, params) {
  const key = cacheKey(url, params);

  const fresh = readFresh(key);
  if (fresh) return fresh;

  let lastError;

  for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt += 1) {
    try {
      const response = await api.get(url, { params });
      write(key, response.data);
      return response.data;
    } catch (error) {
      lastError = error;
      if (!isRetryable(error) || attempt === RETRY_DELAYS.length) break;
      await sleep(RETRY_DELAYS[attempt]);
    }
  }

  /* Every attempt failed. If this exact request has succeeded before, show
     that answer rather than an error page — it is real data this API returned,
     just not from this minute. The caller marks it stale for the reader. */
  const stale = readStale(key);
  if (stale) {
    const error = new Error('stale');
    error.stale = stale;
    throw error;
  }

  throw lastError;
}

export const getProjects = (params) => get('/projects', params);
export const getProjectFilters = () => get('/projects/meta');
export const getFeaturedProjects = (limit = 6) => get('/projects/featured', { limit });
export const getProject = (slug) => get(`/projects/${slug}`);
export const getSkills = () => get('/skills');
export const getExperience = () => get('/experience');
export const getProfile = () => get('/profile');

/* Not cached and not retried: sending the same message twice is worse than
   showing the sender an error they can act on. */
export const sendContactMessage = (payload) =>
  api.post('/contact', payload).then((r) => r.data);

/** Drops every cached response, so a manual retry really does hit the network. */
export const resetCache = clear;

export const errorMessage = (error, fallback = 'Something went wrong. Please try again.') =>
  error?.response?.data?.errors?.join(' ') ||
  error?.response?.data?.message ||
  (error?.code === 'ECONNABORTED'
    ? 'The server is taking longer than usual to respond. It may be waking up — try again in a moment.'
    : fallback);

export default api;
