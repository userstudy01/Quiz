import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API, { apiError } from '../utils/api';
import { Loader, PageHeader } from '../components/ui';

const Stat = ({ label, value, to }) => (
  <Link
    to={to}
    className="rounded-xl border border-line bg-surface p-5 transition-colors hover:border-ink/25"
  >
    <p className="text-sm text-ink-muted">{label}</p>
    <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
  </Link>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.all([
      API.get('/projects/admin/all'),
      API.get('/skills/admin/all'),
      API.get('/experience/admin/all'),
      API.get('/contact', { params: { limit: 5 } }),
    ])
      .then(([projects, skills, experience, messages]) => {
        if (!active) return;
        const projectList = projects.data || [];
        setStats({
          projects: projectList.length,
          published: projectList.filter((p) => p.status === 'published').length,
          featured: projectList.filter((p) => p.featured).length,
          skills: skills.data.length,
          experience: experience.data.length,
          messages: messages.data.total,
          unread: messages.data.unread,
        });
        setRecent(messages.data.items || []);
      })
      .catch((err) => active && setError(apiError(err, 'Could not load dashboard data.')))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <PageHeader title="Dashboard" description="Overview of your portfolio content." />

      {loading ? (
        <Loader />
      ) : error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Projects" value={stats.projects} to="/projects" />
            <Stat label="Published" value={stats.published} to="/projects" />
            <Stat label="Featured" value={stats.featured} to="/projects" />
            <Stat label="Unread messages" value={stats.unread} to="/messages" />
            <Stat label="Skills" value={stats.skills} to="/skills" />
            <Stat label="Experience entries" value={stats.experience} to="/experience" />
            <Stat label="Total messages" value={stats.messages} to="/messages" />
          </div>

          <section className="mt-10">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-ink-muted">
              Recent messages
            </h2>
            {recent.length ? (
              <ul className="divide-y divide-line rounded-xl border border-line bg-surface">
                {recent.map((message) => (
                  <li key={message._id} className="flex flex-col gap-1 p-4 sm:flex-row sm:justify-between">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {message.subject}
                        {!message.read ? (
                          <span className="ml-2 rounded-md bg-ink px-1.5 py-0.5 text-[10px] uppercase text-white">
                            New
                          </span>
                        ) : null}
                      </p>
                      <p className="truncate text-sm text-ink-muted">
                        {message.name} · {message.email}
                      </p>
                    </div>
                    <p className="shrink-0 text-xs text-ink-muted">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-xl border border-dashed border-line bg-surface p-8 text-center text-sm text-ink-muted">
                No messages yet.
              </p>
            )}
          </section>
        </>
      )}
    </>
  );
}
