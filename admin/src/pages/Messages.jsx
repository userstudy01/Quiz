import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API, { apiError } from '../utils/api';
import { buildReplyMailto, isValidEmail } from '../utils/format';
import {
  Button,
  ConfirmDialog,
  EmptyRow,
  Loader,
  Modal,
  PageHeader,
  Toast,
  inputClass,
} from '../components/ui';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selected, setSelected] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Load the whole (small) inbox once; filter + search happen client-side so
  // there are no extra requests and results are instant.
  const load = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const { data } = await API.get('/contact', { params: { limit: 100 } });
      setMessages(data.items || []);
    } catch (err) {
      setLoadError(apiError(err, 'Could not load messages.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Deep-link from a notification: ?open=<id> opens that message and marks it read.
  useEffect(() => {
    const openId = searchParams.get('open');
    if (!openId || loading) return;
    const msg = messages.find((m) => m._id === openId);
    if (msg) {
      setSelected(msg);
      if (!msg.read) setRead(msg, true);
    }
    setSearchParams({}, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, loading, messages]);

  const unread = useMemo(() => messages.filter((m) => !m.read).length, [messages]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return messages.filter((m) => {
      if (filter === 'read' && !m.read) return false;
      if (filter === 'unread' && m.read) return false;
      if (!term) return true;
      return [m.name, m.email, m.subject, m.message]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(term));
    });
  }, [messages, filter, search]);

  const setRead = async (message, read) => {
    try {
      const { data } = await API.patch(`/contact/${message._id}`, { read });
      setMessages((prev) => prev.map((m) => (m._id === data._id ? data : m)));
      setSelected((prev) => (prev && prev._id === data._id ? data : prev));
    } catch (err) {
      setToast({ type: 'error', message: apiError(err, 'Update failed.') });
    }
  };

  const openMessage = (message) => {
    setSelected(message);
    if (!message.read) setRead(message, true);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await API.delete(`/contact/${pendingDelete._id}`);
      setMessages((prev) => prev.filter((m) => m._id !== pendingDelete._id));
      setPendingDelete(null);
      setSelected(null);
      setToast({ type: 'success', message: 'Message deleted.' });
    } catch (err) {
      setToast({ type: 'error', message: apiError(err, 'Delete failed.') });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Messages"
        description={`${unread} unread message${unread === 1 ? '' : 's'}.`}
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, subject…"
              aria-label="Search messages"
              className={`${inputClass} sm:w-64`}
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              aria-label="Filter messages"
              className={`${inputClass} sm:w-36`}
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>
        }
      />

      {loading ? (
        <Loader />
      ) : loadError ? (
        <div className="rounded-xl border border-danger/30 bg-danger-soft px-4 py-4 text-sm text-danger" role="alert">
          <p>{loadError}</p>
          <button
            type="button"
            onClick={load}
            className="mt-3 rounded-lg border border-red-300 px-3 py-1.5 text-xs hover:bg-red-100"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-card border border-line bg-surface shadow-card">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead className="border-b border-line bg-canvas/70 text-xs font-semibold uppercase tracking-wider text-ink-subtle">
              <tr>
                <th className="px-4 py-3 font-medium">From</th>
                <th className="px-4 py-3 font-medium">Message</th>
                <th className="px-4 py-3 font-medium">Received</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {visible.length ? (
                visible.map((message) => (
                  <tr key={message._id} className={message.read ? '' : 'bg-canvas'}>
                    <td className="max-w-[14rem] px-4 py-3 align-top">
                      <p className="font-medium">{message.name}</p>
                      <p className="break-all text-xs text-ink-muted">{message.email}</p>
                    </td>
                    <td className="max-w-[22rem] px-4 py-3 align-top">
                      <button
                        type="button"
                        onClick={() => openMessage(message)}
                        className="text-left font-medium hover:underline"
                      >
                        {message.subject}
                      </button>
                      {!message.read ? (
                        <span className="ml-2 rounded-md bg-ink px-1.5 py-0.5 text-[10px] uppercase text-white">
                          New
                        </span>
                      ) : null}
                      <p className="mt-0.5 line-clamp-1 text-xs text-ink-muted">{message.message}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 align-top text-ink-muted">
                      {new Date(message.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openMessage(message)}
                          className="rounded-lg border border-line px-2.5 py-1.5 text-xs hover:border-ink/30"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => setRead(message, !message.read)}
                          className="rounded-lg border border-line px-2.5 py-1.5 text-xs hover:border-ink/30"
                        >
                          Mark {message.read ? 'unread' : 'read'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingDelete(message)}
                          className="rounded-lg border border-danger/30 px-2.5 py-1.5 text-xs text-danger hover:bg-danger-soft"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <EmptyRow
                  colSpan={4}
                  message={
                    messages.length ? 'No messages match your search or filter.' : 'No messages yet.'
                  }
                />
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={Boolean(selected)}
        wide
        title={selected?.subject || 'Message'}
        onClose={() => setSelected(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setSelected(null)}>
              Close
            </Button>
            {selected ? (
              <button
                type="button"
                onClick={() => setRead(selected, !selected.read)}
                className="rounded-lg border border-line px-3.5 py-2.5 text-sm font-medium hover:border-ink/30"
              >
                Mark {selected.read ? 'unread' : 'read'}
              </button>
            ) : null}
            {selected && isValidEmail(selected.email) ? (
              <a
                href={buildReplyMailto(selected)}
                aria-label={`Reply by email to ${selected.name}`}
                className="inline-flex items-center rounded-lg bg-ink px-3.5 py-2.5 text-sm font-medium text-white hover:opacity-90"
              >
                Reply
              </a>
            ) : selected ? (
              <span
                aria-disabled="true"
                title="This message has no valid sender email, so a reply cannot be prepared."
                className="inline-flex cursor-not-allowed items-center rounded-lg bg-ink/40 px-3.5 py-2.5 text-sm font-medium text-white"
              >
                Reply
              </span>
            ) : null}
          </>
        }
      >
        {selected ? (
          <div className="space-y-3 text-sm">
            <p className="break-words text-ink-muted">
              From <span className="font-medium text-ink">{selected.name}</span> · {selected.email}
            </p>
            {!isValidEmail(selected.email) ? (
              <p className="rounded-lg border border-warn/30 bg-warn-soft px-3 py-2 text-xs text-warn">
                This message has no valid sender email — you cannot reply to it directly.
              </p>
            ) : null}
            <p className="text-ink-muted">{new Date(selected.createdAt).toLocaleString()}</p>
            <p className="whitespace-pre-line break-words border-t border-line pt-4">{selected.message}</p>
          </div>
        ) : null}
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete message"
        message={`Delete the message from ${pendingDelete?.name} (“${pendingDelete?.subject}”)? This cannot be undone.`}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        busy={deleting}
      />

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </>
  );
}
