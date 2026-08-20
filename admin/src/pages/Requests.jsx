import { useCallback, useEffect, useState } from 'react';
import API, { apiError } from '../utils/api';
import { Badge, EmptyRow, Loader, PageHeader, Toast } from '../components/ui';

const STATUS_TONE = { pending: 'warn', approved: 'success', rejected: 'danger' };

function StatusBadge({ status }) {
  return <Badge tone={STATUS_TONE[status] || 'neutral'}>{status}</Badge>;
}

export default function Requests() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [toast, setToast] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/auth/users');
      setUsers(data);
    } catch (err) {
      setToast({ type: 'error', message: apiError(err, 'Could not load users.') });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (user, status) => {
    setBusyId(user._id);
    try {
      const { data } = await API.patch(`/auth/users/${user._id}`, { status });
      setUsers((prev) => prev.map((u) => (u._id === data.id ? { ...u, ...data, _id: data.id } : u)));
      setToast({
        type: 'success',
        message: status === 'approved' ? `${data.name} approved as ${data.role}.` : `${data.name} rejected.`,
      });
    } catch (err) {
      setToast({ type: 'error', message: apiError(err, 'Action failed.') });
    } finally {
      setBusyId(null);
    }
  };

  const pendingCount = users.filter((u) => u.status === 'pending').length;

  return (
    <>
      <PageHeader
        title="Access requests"
        description={`${pendingCount} pending request${pendingCount === 1 ? '' : 's'}.`}
      />

      {loading ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto rounded-card border border-line bg-surface shadow-card">
          <table className="w-full min-w-[48rem] text-left text-sm">
            <thead className="border-b border-line bg-canvas/70 text-xs font-semibold uppercase tracking-wider text-ink-subtle">
              <tr>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Requested</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {users.length ? (
                users.map((user) => {
                  const isSuper = user.role === 'superadmin';
                  const isPending = user.status === 'pending';
                  return (
                    <tr key={user._id}>
                      <td className="px-4 py-3">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-ink-muted">{user.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-ink-muted">{isPending ? 'admin (on approval)' : user.role}</span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={user.status || 'approved'} />
                      </td>
                      <td className="px-4 py-3 text-ink-muted">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          {isSuper ? (
                            <span className="text-xs text-ink-muted">Owner</span>
                          ) : (
                            <>
                              <button
                                type="button"
                                disabled={busyId === user._id || user.status === 'approved'}
                                onClick={() => act(user, 'approved')}
                                className="rounded-lg border border-success/30 px-2.5 py-1.5 text-xs text-success hover:bg-success-soft disabled:opacity-50"
                              >
                                {isPending ? 'Approve' : 'Approved'}
                              </button>
                              <button
                                type="button"
                                disabled={busyId === user._id || user.status === 'rejected'}
                                onClick={() => act(user, 'rejected')}
                                className="rounded-lg border border-danger/30 px-2.5 py-1.5 text-xs text-danger hover:bg-danger-soft disabled:opacity-50"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <EmptyRow colSpan={5} message="No users yet." />
              )}
            </tbody>
          </table>
        </div>
      )}

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </>
  );
}
