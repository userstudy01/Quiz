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

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return projects.filter((project) => {
      if (statusFilter !== 'all' && project.status !== statusFilter) return false;
      if (!term) return true;
      return [project.title, project.category, project.role, (project.technologies || []).join(' ')]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term));
    });
  }, [projects, search, statusFilter]);

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
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-surface">
          <table className="w-full min-w-[52rem] text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-muted">
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
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{project.category || '—'}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() =>
                          patch(project, { status: project.status === 'published' ? 'draft' : 'published' })
                        }
                        className={`rounded-md border px-2 py-1 text-xs ${
                          project.status === 'published'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-line bg-canvas text-ink-muted'
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
