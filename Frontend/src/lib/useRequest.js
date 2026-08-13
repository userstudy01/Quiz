import { useCallback, useEffect, useState } from 'react';
import { errorMessage } from './api';

/**
 * Minimal data-fetching hook: runs `request` on mount and whenever `deps`
 * change, and ignores results from stale requests.
 */
export default function useRequest(request, deps = [], { skip = false } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState('');

  const run = useCallback(() => {
    let active = true;
    setLoading(true);
    setError('');

    request()
      .then((result) => {
        if (active) setData(result);
      })
      .catch((err) => {
        if (active) setError(errorMessage(err, 'Could not load this content.'));
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

  return { data, loading, error, reload: run };
}
