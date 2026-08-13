import { useCallback, useEffect, useState } from 'react';
import API, { apiError } from '../utils/api';
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
  const [unread, setUnread] = useState(0);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = filter === 'all' ? {} : { read: filter === 'read' ? 'true' : 'false' };
      const { data } = await API.get('/contact', { params });
      setMessages(data.items);
      setUnread(data.unread);
    } catch (err) {
      setToast({ type: 'error', message: apiError(err, 'Could not load messages.') });
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const setRead = async (message, read) => {
    try {
      const { data } = await API.patch(`/contact/${message._id}`, { read });
      setMessages((prev) =>
        filter === 'all' ? prev.map((m) => (m._id === data._id ? data : m)) : prev.filter((m) => m._id !== data._id)
      );
      setUnread((prev) => Math.max(0, prev + (read ? -1 : 1)));
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
      if (!pendingDelete.read) setUnread((prev) => Math.max(0, prev - 1));
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
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="Filter messages"
            className={`${inputClass} sm:w-40`}
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        }
      />

      {loading ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-surface">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3 font-medium">From</th>
                <th className="px-4 py-3 font-medium">Subject</th>
                <th className="px-4 py-3 font-medium">Received</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {messages.length ? (
                messages.map((message) => (
                  <tr key={message._id} className={message.read ? '' : 'bg-canvas'}>
                    <td className="px-4 py-3">
                      <p className="font-medium">{message.name}</p>
                      <p className="text-xs text-ink-muted">{message.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <button type="button" onClick={() => openMessage(message)} className="hover:underline">
                        {message.subject}
                      </button>
                      {!message.read ? (
                        <span className="ml-2 rounded-md bg-ink px-1.5 py-0.5 text-[10px] uppercase text-white">
                          New
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-ink-muted">
                      {new Date(message.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
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
                          className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <EmptyRow colSpan={4} message="No messages." />
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
              <a
                href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                className="inline-flex items-center rounded-lg bg-ink px-3.5 py-2.5 text-sm font-medium text-white hover:opacity-90"
              >
                Reply by email
              </a>
            ) : null}
          </>
        }
      >
        {selected ? (
          <div className="space-y-3 text-sm">
            <p className="text-ink-muted">
              From <span className="font-medium text-ink">{selected.name}</span> · {selected.email}
            </p>
            <p className="text-ink-muted">{new Date(selected.createdAt).toLocaleString()}</p>
            <p className="whitespace-pre-line border-t border-line pt-4">{selected.message}</p>
          </div>
        ) : null}
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete message"
        message={`Delete the message from ${pendingDelete?.name}?`}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        busy={deleting}
      />

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </>
  );
}
