import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API, { apiError } from '../utils/api';
import { Button, Field, Loader, PageHeader, Toast, inputClass } from '../components/ui';

// List fields are edited as one-item-per-line text areas and sent as strings;
// the API normalizes them into arrays.
const LIST_FIELDS = [
  ['technologies', 'Technologies'],
  ['responsibilities', 'Responsibilities'],
  ['features', 'Features'],
  ['technicalWork', 'Technical Work'],
  ['improvements', 'Improvements'],
  ['challenges', 'Challenges'],
  ['solutions', 'Solutions'],
];

const EMPTY = {
  title: '',
  slug: '',
  shortDescription: '',
  description: '',
  category: '',
  role: '',
  result: '',
  liveUrl: '',
  githubUrl: '',
  featured: false,
  status: 'published',
  sortOrder: 0,
  technologies: '',
  responsibilities: '',
  features: '',
  technicalWork: '',
  improvements: '',
  challenges: '',
  solutions: '',
};

const toForm = (project) => ({
  ...EMPTY,
  ...project,
  sortOrder: project.sortOrder ?? 0,
  ...Object.fromEntries(
    LIST_FIELDS.map(([key]) => [key, (project[key] || []).join('\n')])
  ),
});

export default function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [screenshots, setScreenshots] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!isEdit) return;

    let active = true;
    API.get(`/projects/admin/${id}`)
      .then(({ data }) => {
        if (!active) return;
        setForm(toForm(data));
        setScreenshots(data.screenshots || []);
      })
      .catch((err) => setToast({ type: 'error', message: apiError(err, 'Could not load project.') }))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [id, isEdit]);

  const set = (key) => (event) => {
    const value =
      event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateShot = (index, key, value) =>
    setScreenshots((prev) => prev.map((s, i) => (i === index ? { ...s, [key]: value } : s)));

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      sortOrder: Number(form.sortOrder) || 0,
      screenshots: screenshots.filter((s) => s.url?.trim()),
    };

    try {
      if (isEdit) {
        await API.put(`/projects/${id}`, payload);
        setToast({ type: 'success', message: 'Project saved.' });
      } else {
        const { data } = await API.post('/projects', payload);
        navigate(`/projects/${data._id}`, { replace: true });
        setToast({ type: 'success', message: 'Project created.' });
      }
    } catch (err) {
      setToast({ type: 'error', message: apiError(err, 'Save failed.') });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading project…" />;

  return (
    <>
      <PageHeader
        title={isEdit ? 'Edit project' : 'New project'}
        description="Leave any field empty if you do not have real data for it — empty sections are hidden on the public site."
        action={
          <Button variant="secondary" onClick={() => navigate('/projects')}>
            Back to list
          </Button>
        }
      />

      <form onSubmit={submit} className="space-y-6 pb-10">
        <section className="rounded-xl border border-line bg-surface p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-ink-muted">Basics</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Title">
              <input required value={form.title} onChange={set('title')} className={inputClass} />
            </Field>
            <Field label="Slug" hint="Leave empty to generate from the title. Used in /projects/:slug">
              <input value={form.slug} onChange={set('slug')} className={inputClass} />
            </Field>
            <Field label="Category">
              <input value={form.category} onChange={set('category')} className={inputClass} />
            </Field>
            <Field label="My role">
              <input value={form.role} onChange={set('role')} className={inputClass} />
            </Field>
            <Field label="Short description" className="sm:col-span-2">
              <textarea
                rows={2}
                value={form.shortDescription}
                onChange={set('shortDescription')}
                className={inputClass}
              />
            </Field>
            <Field label="Overview" className="sm:col-span-2">
              <textarea rows={6} value={form.description} onChange={set('description')} className={inputClass} />
            </Field>
          </div>
        </section>

        <section className="rounded-xl border border-line bg-surface p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-ink-muted">Details</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {LIST_FIELDS.map(([key, label]) => (
              <Field key={key} label={label} hint="One item per line">
                <textarea rows={5} value={form[key]} onChange={set(key)} className={inputClass} />
              </Field>
            ))}
            <Field label="Results" className="sm:col-span-2">
              <textarea rows={3} value={form.result} onChange={set('result')} className={inputClass} />
            </Field>
          </div>
        </section>

        <section className="rounded-xl border border-line bg-surface p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-muted">Screenshots</h2>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setScreenshots((prev) => [...prev, { url: '', caption: '' }])}
            >
              Add screenshot
            </Button>
          </div>

          {screenshots.length ? (
            <div className="space-y-4">
              {screenshots.map((shot, index) => (
                <div key={index} className="grid gap-3 sm:grid-cols-[2fr_1fr_auto] sm:items-end">
                  <Field label={`Image URL ${index + 1}`}>
                    <input
                      value={shot.url}
                      onChange={(e) => updateShot(index, 'url', e.target.value)}
                      placeholder="https://…"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Caption">
                    <input
                      value={shot.caption || ''}
                      onChange={(e) => updateShot(index, 'caption', e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => setScreenshots((prev) => prev.filter((_, i) => i !== index))}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-muted">No screenshots yet.</p>
          )}
        </section>

        <section className="rounded-xl border border-line bg-surface p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-ink-muted">
            Links & publishing
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Live URL">
              <input value={form.liveUrl} onChange={set('liveUrl')} className={inputClass} />
            </Field>
            <Field label="GitHub URL">
              <input value={form.githubUrl} onChange={set('githubUrl')} className={inputClass} />
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={set('status')} className={inputClass}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </Field>
            <Field label="Sort order">
              <input type="number" value={form.sortOrder} onChange={set('sortOrder')} className={inputClass} />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.featured} onChange={set('featured')} className="h-4 w-4" />
              Featured project
            </label>
          </div>
        </section>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create project'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/projects')}>
            Cancel
          </Button>
        </div>
      </form>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </>
  );
}
