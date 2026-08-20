import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API, { apiError } from '../utils/api';
import { Button, ConfirmDialog, EmptyRow, Loader, PageHeader, Toast, inputClass } from '../components/ui';

export default function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [toast, setToast] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/projects/admin/all');
      setProjects(data);
    } catch (err) {
      setToast({ type: 'error', message: apiError(err, 'Could not load projects.') });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const categories = useMemo(
    () => [...new Set(projects.map((p) => p.category).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [projects]
  );

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return projects.filter((project) => {
      if (statusFilter !== 'all' && project.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && project.category !== categoryFilter) return false;
      if (!term) return true;
      return [project.title, project.category, project.role, (project.technologies || []).join(' ')]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term));
    });
  }, [projects, search, statusFilter, categoryFilter]);

  const patch = async (project, body) => {
    try {
      const { data } = await API.patch(`/projects/${project._id}/flags`, body);
      setProjects((prev) => prev.map((p) => (p._id === data._id ? data : p)));
    } catch (err) {
      setToast({ type: 'error', message: apiError(err, 'Update failed.') });
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await API.delete(`/projects/${pendingDelete._id}`);
      setProjects((prev) => prev.filter((p) => p._id !== pendingDelete._id));
      setToast({ type: 'success', message: 'Project deleted.' });
      setPendingDelete(null);
    } catch (err) {
      setToast({ type: 'error', message: apiError(err, 'Delete failed.') });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Projects"
        description={`${projects.length} project${projects.length === 1 ? '' : 's'} in the database.`}
        action={<Button onClick={() => navigate('/projects/new')}>Add project</Button>}
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects"
          className={`${inputClass} sm:max-w-xs`}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`${inputClass} sm:max-w-[12rem]`}
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className={`${inputClass} sm:max-w-[14rem]`}
          aria-label="Filter by category"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto rounded-card border border-line bg-surface shadow-card">
          <table className="w-full min-w-[52rem] text-left text-sm">
            <thead className="border-b border-line bg-canvas/70 text-xs font-semibold uppercase tracking-wider text-ink-subtle">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Featured</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {visible.length ? (
                visible.map((project) => (
                  <tr key={project._id}>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        defaultValue={project.sortOrder}
                        onBlur={(e) => {
                          const value = Number(e.target.value);
                          if (value !== project.sortOrder) patch(project, { sortOrder: value });
                        }}
                        aria-label={`Sort order for ${project.title}`}
                        className="w-16 rounded-lg border border-line px-2 py-1 text-sm focus:outline-none"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/projects/${project._id}`} className="font-medium hover:underline">
                        {project.title}
                      </Link>
                      <p className="text-xs text-ink-muted">/{project.slug}</p>
                      {project.technologies?.length ? (
                        <ul className="mt-1.5 flex flex-wrap gap-1">
                          {project.technologies.slice(0, 4).map((tech) => (
                            <li key={tech} className="rounded border border-line bg-canvas px-1.5 py-0.5 text-[11px] text-ink-muted">
                              {tech}
                            </li>
                          ))}
                          {project.technologies.length > 4 ? (
                            <li className="px-1 py-0.5 text-[11px] text-ink-muted">+{project.technologies.length - 4}</li>
                          ) : null}
                        </ul>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{project.category || '—'}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() =>
                          patch(project, { status: project.status === 'published' ? 'draft' : 'published' })
                        }
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                          project.status === 'published'
                            ? 'bg-success-soft text-success hover:brightness-95'
                            : 'bg-canvas text-ink-muted hover:bg-line/60'
                        }`}
                      >
                        {project.status === 'published' ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <label className="inline-flex items-center gap-2 text-xs text-ink-muted">
                        <input
                          type="checkbox"
                          checked={Boolean(project.featured)}
                          onChange={(e) => patch(project, { featured: e.target.checked })}
                          className="h-4 w-4"
                        />
                        Featured
                      </label>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/projects/${project._id}`}
                          className="rounded-lg border border-line px-2.5 py-1.5 text-xs hover:border-ink/30"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => setPendingDelete(project)}
                          className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <EmptyRow colSpan={6} message="No projects match this filter." />
              )}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete project"
        message={`Delete "${pendingDelete?.title}"? This cannot be undone.`}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        busy={deleting}
      />

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </>
  );
}
