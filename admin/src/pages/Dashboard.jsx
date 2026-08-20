import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API, { apiError, getStoredAuth } from '../utils/api';
import { PageHeader } from '../components/ui';

/* ---------- small presentational helpers ---------- */

function StatCard({ label, value, sub, to, loading, error }) {
  const body = (
    <>
      <p className="text-sm text-ink-muted">{label}</p>
      {loading ? (
        <span className="mt-3 block h-8 w-14 animate-pulse rounded bg-line" aria-hidden="true" />
      ) : error ? (
        <p className="mt-2 text-sm text-red-600">Unavailable</p>
      ) : (
        <p className="mt-2 text-3xl font-semibold tracking-tight">
          {value}
          {sub ? <span className="ml-2 align-middle text-sm font-normal text-ink-muted">{sub}</span> : null}
        </p>
      )}
    </>
  );

  const className =
    'lift block rounded-card border border-line bg-surface p-5 shadow-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent';

  return to && !loading && !error ? (
    <Link to={to} className={className}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    published: 'bg-emerald-100 text-emerald-700',
    draft: 'bg-amber-100 text-amber-700',
    archived: 'bg-slate-200 text-slate-600',
  };
  return (
    <span
      className={`rounded-md px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${
        styles[status] || 'bg-line text-ink-muted'
      }`}
    >
      {status || 'unknown'}
    </span>
  );
}

function SectionError({ message }) {
  return (
    <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
      {message}
    </p>
  );
}

function EmptyBox({ children }) {
  return (
    <p className="rounded-xl border border-dashed border-line bg-surface p-8 text-center text-sm text-ink-muted">
      {children}
    </p>
  );
}

const QUICK_ACTIONS = [
  { to: '/projects', label: 'Manage Projects', desc: 'Edit and feature work' },
  { to: '/skills', label: 'Manage Skills', desc: 'Group and order skills' },
  { to: '/experience', label: 'Manage Experience', desc: 'Timeline entries' },
  { to: '/messages', label: 'View Messages', desc: 'Contact enquiries' },
  { to: '/profile', label: 'Profile', desc: 'Bio and links' },
];

/* ---------- page ---------- */

export default function Dashboard() {
  const auth = getStoredAuth();
  const isSuperAdmin = auth?.user?.role === 'superadmin';

  const [res, setRes] = useState(null); // { key: {ok, value|error} }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const calls = [
      ['projects', API.get('/projects/admin/all')],
      ['skills', API.get('/skills/admin/all')],
      ['experience', API.get('/experience/admin/all')],
      ['messages', API.get('/contact', { params: { limit: 5 } })],
    ];
    // The users endpoint is super-admin only; skip it for regular admins so a
    // guaranteed 403 doesn't show as a broken widget.
    if (isSuperAdmin) calls.push(['users', API.get('/auth/users')]);

    Promise.allSettled(calls.map(([, p]) => p)).then((settled) => {
      if (!active) return;
      const out = {};
      settled.forEach((s, i) => {
        const key = calls[i][0];
        out[key] =
          s.status === 'fulfilled'
            ? { ok: true, value: s.value.data }
            : { ok: false, error: apiError(s.reason, 'Could not load.') };
      });
      setRes(out);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [isSuperAdmin]);

  // Derived, resilient reads — a failed slice never throws.
  const projects = res?.projects?.ok ? res.projects.value || [] : [];
  const skills = res?.skills?.ok ? res.skills.value || [] : [];
  const experience = res?.experience?.ok ? res.experience.value || [] : [];
  const messages = res?.messages?.ok ? res.messages.value : null;
  const users = res?.users?.ok ? res.users.value || [] : [];

  const featuredCount = projects.filter((p) => p.featured).length;
  const pendingCount = users.filter((u) => u.status === 'pending').length;
  const recentMessages = messages?.items || [];
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  const err = (key) => (res && !res[key]?.ok ? res[key]?.error : null);

  return (
    <>
      <PageHeader
        title={`Welcome${auth?.user?.name ? `, ${auth.user.name.split(' ')[0]}` : ''}`}
        description="Overview of your portfolio content."
      />

      {/* ---------- Overview statistics ---------- */}
      <section aria-label="Overview statistics">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard label="Projects" value={projects.length} to="/projects" loading={loading} error={err('projects')} />
          <StatCard label="Featured" value={featuredCount} to="/projects" loading={loading} error={err('projects')} />
          <StatCard label="Skills" value={skills.length} to="/skills" loading={loading} error={err('skills')} />
          <StatCard
            label="Experience"
            value={experience.length}
            to="/experience"
            loading={loading}
            error={err('experience')}
          />
          <StatCard
            label="Messages"
            value={messages?.total ?? 0}
            sub={messages?.unread ? `${messages.unread} new` : null}
            to="/messages"
            loading={loading}
            error={err('messages')}
          />
          {isSuperAdmin ? (
            <StatCard
              label="Pending requests"
              value={pendingCount}
              to="/requests"
              loading={loading}
              error={err('users')}
            />
          ) : null}
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* ---------- Project overview ---------- */}
        <section aria-label="Project overview" className="min-w-0 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-muted">Projects</h2>
            <Link to="/projects" className="text-sm font-medium text-ink hover:underline">
              View all projects →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-2" aria-hidden="true">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-14 animate-pulse rounded-card border border-line bg-surface shadow-card" />
              ))}
            </div>
          ) : err('projects') ? (
            <SectionError message={err('projects')} />
          ) : recentProjects.length ? (
            <div className="overflow-x-auto rounded-card border border-line bg-surface shadow-card">
              <table className="w-full min-w-[34rem] text-left text-sm">
                <thead className="border-b border-line bg-canvas/70 text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                  <tr>
                    <th className="px-4 py-3 font-medium">Project</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 text-right font-medium">Featured</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {recentProjects.map((p) => (
                    <tr key={p._id} className="hover:bg-canvas">
                      <td className="px-4 py-3 font-medium">
                        <Link to={`/projects/${p._id}`} className="hover:text-ink hover:underline">
                          {p.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-ink-muted">{p.category || '—'}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        {p.featured ? (
                          <span className="text-accent" title="Featured" aria-label="Featured">
                            ★
                          </span>
                        ) : (
                          <span className="text-ink-muted" aria-label="Not featured">
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyBox>No projects yet.</EmptyBox>
          )}
        </section>

        {/* ---------- Quick actions ---------- */}
        <section aria-label="Quick actions">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-ink-muted">Quick actions</h2>
          <nav className="space-y-2">
            {QUICK_ACTIONS.map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className="flex items-center justify-between rounded-card border border-line bg-surface shadow-card px-4 py-3 transition-colors hover:border-ink/25"
              >
                <span>
                  <span className="block text-sm font-medium">{a.label}</span>
                  <span className="block text-xs text-ink-muted">{a.desc}</span>
                </span>
                <span aria-hidden="true" className="text-ink-muted">
                  →
                </span>
              </Link>
            ))}
            {isSuperAdmin ? (
              <Link
                to="/requests"
                className="flex items-center justify-between rounded-card border border-line bg-surface shadow-card px-4 py-3 transition-colors hover:border-ink/25"
              >
                <span>
                  <span className="block text-sm font-medium">Access requests</span>
                  <span className="block text-xs text-ink-muted">
                    {pendingCount ? `${pendingCount} pending` : 'Approve new admins'}
                  </span>
                </span>
                <span aria-hidden="true" className="text-ink-muted">
                  →
                </span>
              </Link>
            ) : null}
          </nav>
        </section>
      </div>

      {/* ---------- Recent activity (recent messages) ---------- */}
      <section aria-label="Recent activity" className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-muted">Recent messages</h2>
          {messages?.total ? (
            <Link to="/messages" className="text-sm font-medium text-ink hover:underline">
              All messages →
            </Link>
          ) : null}
        </div>

        {loading ? (
          <div className="h-24 animate-pulse rounded-card border border-line bg-surface shadow-card" aria-hidden="true" />
        ) : err('messages') ? (
          <SectionError message={err('messages')} />
        ) : recentMessages.length ? (
          <ul className="divide-y divide-line rounded-card border border-line bg-surface shadow-card">
            {recentMessages.map((m) => (
              <li key={m._id} className="flex flex-col gap-1 p-4 sm:flex-row sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {m.subject}
                    {!m.read ? (
                      <span className="ml-2 rounded-md bg-ink px-1.5 py-0.5 text-[10px] uppercase text-white">
                        New
                      </span>
                    ) : null}
                  </p>
                  <p className="truncate text-sm text-ink-muted">
                    {m.name} · {m.email}
                  </p>
                </div>
                <p className="shrink-0 text-xs text-ink-muted">
                  {new Date(m.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyBox>No messages yet.</EmptyBox>
        )}
      </section>
    </>
  );
}
