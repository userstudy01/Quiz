import { useCallback, useEffect, useState } from 'react';
import API, { apiError } from '../utils/api';
import { EmptyRow, Loader, PageHeader, Toast } from '../components/ui';

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
};

function StatusBadge({ status }) {
  return (
    <span
      className={`rounded-md px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${
        STATUS_STYLES[status] || 'bg-line text-ink-muted'
      }`}
    >
      {status}
    </span>
  );
}

export default function Requests() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [roleChoice, setRoleChoice] = useState({}); // userId -> 'admin' | 'editor'
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
      const role = roleChoice[user._id] || 'editor';
      const { data } = await API.patch(`/auth/users/${user._id}`, { status, role });
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
        <div className="overflow-x-auto rounded-xl border border-line bg-surface">
          <table className="w-full min-w-[48rem] text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-muted">
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
                        {isPending ? (
                          <select
                            value={roleChoice[user._id] || 'editor'}
                            onChange={(e) =>
                              setRoleChoice((prev) => ({ ...prev, [user._id]: e.target.value }))
                            }
                            aria-label="Assign role"
                            className="rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs focus:border-ink/30 focus:outline-none"
                          >
                            <option value="editor">editor</option>
                            <option value="admin">admin</option>
                          </select>
                        ) : (
                          <span className="text-ink-muted">{user.role}</span>
                        )}
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
                                className="rounded-lg border border-emerald-200 px-2.5 py-1.5 text-xs text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
                              >
                                {isPending ? 'Approve' : 'Approved'}
                              </button>
                              <button
                                type="button"
                                disabled={busyId === user._id || user.status === 'rejected'}
                                onClick={() => act(user, 'rejected')}
                                className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
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
