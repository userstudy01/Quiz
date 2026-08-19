// Privacy-conscious, fire-and-forget page-view tracking. Never blocks rendering
// and never throws — if analytics fails, the portfolio keeps working.

const KEY = 'pv_vid';
const base = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

// Anonymous, client-generated visitor id (for unique-visitor dedup only).
function getVisitorId() {
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id =
        (typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID()) ||
        `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return 'anonymous';
  }
}

export function trackPageView(path, projectSlug = '') {
  try {
    const body = JSON.stringify({
      path,
      projectSlug: projectSlug || '',
      visitorId: getVisitorId(),
      referrer: (typeof document !== 'undefined' && document.referrer) || '',
    });
    const url = `${base}/analytics/track`;

    // sendBeacon is built for fire-and-forget: it survives navigation and never
    // logs console errors. text/plain keeps it a CORS-simple request (no
    // preflight); the server parses the JSON string.
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const ok = navigator.sendBeacon(url, new Blob([body], { type: 'text/plain' }));
      if (ok) return;
    }
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* analytics must never break the page */
  }
}
