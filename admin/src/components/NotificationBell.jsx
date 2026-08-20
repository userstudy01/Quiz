import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API, { apiError } from '../utils/api';

// A "new message" notification is simply an unread ContactMessage, so this
// derives everything from the existing /contact endpoint — no separate store,
// no duplicate data, and reloading can never create duplicate notifications.
const POLL_MS = 60000;

function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function NotificationBell({ onNavigate }) {
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    try {
      const { data } = await API.get('/contact', { params: { read: 'false', limit: 8 } });
      setItems(data.items || []);
      setCount(data.unread || 0);
      setError('');
    } catch (err) {
      setError(apiError(err, 'Could not load notifications.'));
    } finally {
      setLoading(false);
    }
  }, []);

  // Reasonable refresh: on mount, on a gentle interval, and on window focus.
  useEffect(() => {
    load();
    const id = setInterval(load, POLL_MS);
    const onFocus = () => load();
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(id);
      window.removeEventListener('focus', onFocus);
    };
  }, [load]);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const toggle = () => {
    setOpen((v) => {
      if (!v) load();
      return !v;
    });
  };

  const openMessage = async (m) => {
    setOpen(false);
    onNavigate?.();
    try {
      await API.patch(`/contact/${m._id}`, { read: true });
    } catch {
      /* opening the message still proceeds even if marking read fails */
    }
    load();
    navigate(`/messages?open=${m._id}`);
  };

  const markAllRead = async () => {
    try {
      // Bounded to the actual unread set; no bulk endpoint needed.
      const { data } = await API.get('/contact', { params: { read: 'false', limit: 100 } });
      await Promise.all((data.items || []).map((m) => API.patch(`/contact/${m._id}`, { read: true })));
    } catch (err) {
      setError(apiError(err, 'Could not update notifications.'));
    }
    load();
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-label={`Notifications${count ? `, ${count} unread` : ''}`}
        aria-haspopup="true"
        aria-expanded={open}
        className="relative grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface text-ink-muted hover:border-ink/30 hover:text-ink"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.7 21a2 2 0 0 1-3.4 0" />
        </svg>
        {count > 0 ? (
          <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
            {count > 9 ? '9+' : count}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          role="menu"
          className="fixed inset-x-3 top-16 z-[60] overflow-hidden rounded-card border border-line bg-surface shadow-card shadow-xl sm:absolute sm:inset-x-auto sm:left-0 sm:top-full sm:mt-2 sm:w-80"
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
            <span className="text-sm font-semibold">Notifications</span>
            {count > 0 ? (
              <button type="button" onClick={markAllRead} className="text-xs text-ink-muted hover:text-ink">
                Mark all read
              </button>
            ) : null}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <p className="px-4 py-6 text-center text-sm text-ink-muted">Loading…</p>
            ) : error ? (
              <p className="px-4 py-6 text-center text-sm text-danger" role="alert">
                {error}
              </p>
            ) : items.length ? (
              <ul className="divide-y divide-line">
                {items.map((m) => (
                  <li key={m._id}>
                    <button
                      type="button"
                      onClick={() => openMessage(m)}
                      className="block w-full px-4 py-3 text-left hover:bg-canvas"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-sm font-medium">{m.name}</p>
                        <span className="shrink-0 text-[11px] text-ink-muted">{timeAgo(m.createdAt)}</span>
                      </div>
                      <p className="truncate text-xs text-ink-muted">{m.subject}</p>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-4 py-8 text-center text-sm text-ink-muted">You&apos;re all caught up.</p>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onNavigate?.();
              navigate('/messages');
            }}
            className="block w-full border-t border-line px-4 py-2.5 text-center text-sm font-medium hover:bg-canvas"
          >
            View all messages
          </button>
        </div>
      ) : null}
    </div>
  );
}
