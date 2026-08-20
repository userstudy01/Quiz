import { useCallback, useEffect, useState } from 'react';
import { errorMessage, resetCache } from './api';

/**
 * Minimal data-fetching hook: runs `request` on mount and whenever `deps`
 * change, and ignores results from stale requests.
 *
 * One extra case on top of load/error: when every network attempt failed but
 * this exact request has succeeded before, the API layer throws an error
 * carrying the previous response. That is shown as data with `stale` set,
 * because a visitor reading last-known-good content is better served than one
 * looking at an error — and the flag lets the page say so out loud.
 */
export default function useRequest(request, deps = [], { skip = false } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState('');
  const [stale, setStale] = useState(false);

  const run = useCallback(() => {
    let active = true;
    setLoading(true);
    setError('');

    request()
      .then((result) => {
        if (!active) return;
        setData(result);
        setStale(false);
      })
      .catch((err) => {
        if (!active) return;
        if (err?.stale !== undefined) {
          setData(err.stale);
          setStale(true);
          return;
        }
        setError(errorMessage(err, 'Could not load this content.'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    if (skip) {
      setLoading(false);
      return undefined;
    }
    return run();
  }, [run, skip]);

  /* A manual retry has to reach the network, so the cache is dropped first —
     otherwise "Try again" would replay the same cached answer. */
  const reload = useCallback(() => {
    resetCache();
    return run();
  }, [run]);

  return { data, loading, error, stale, reload };
}
